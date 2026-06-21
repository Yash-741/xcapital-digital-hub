const DEFAULT_SIGNATURE_HEADER = "x-lovable-signature";
const DEFAULT_TIMESTAMP_HEADER = "x-lovable-timestamp";
const DEFAULT_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_BODY_BYTES = 1 << 20; // 1 MB

export class EmailAPIError extends Error {
  status: number;
  retryAfterSeconds: number | null;

  constructor(status: number, message: string, retryAfterSeconds: number | null) {
    super(message);
    this.name = "EmailAPIError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }

  get retryable() {
    return this.status === 429 || (this.status >= 500 && this.status < 600);
  }
}

export class WebhookError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const parsed = Number(header);
  if (!Number.isNaN(parsed)) return parsed;
  const date = new Date(header);
  if (!Number.isNaN(date.getTime())) {
    return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));
  }
  return null;
}

export async function sendTransactionalEmail(
  payload: Record<string, any>,
  options: {
    apiKey: string;
    sendUrl?: string;
    apiBaseUrl?: string;
    authHeader?: string;
    idempotencyKey?: string;
  }
) {
  const { apiKey } = options;
  if (!apiKey) {
    throw new Error("Missing email API key");
  }

  const authHeader = options.authHeader ?? "Authorization";
  const apiBaseUrl = options.apiBaseUrl ?? "https://api.lovable.dev";
  const url = options.sendUrl || `${apiBaseUrl.replace(/\/$/, "")}/v1/messaging/email/send`;
  const idempotencyKey = options.idempotencyKey ?? payload.idempotency_key ?? payload.run_id;

  const headers: Record<string, string> = {
    [authHeader]: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };

  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    const safeErrorText = errorText.length > 500 ? `${errorText.slice(0, 500)}...` : errorText;
    throw new EmailAPIError(
      response.status,
      `Email API error: ${response.status} ${safeErrorText}`,
      parseRetryAfter(response.headers.get("Retry-After"))
    );
  }

  return await response.json();
}

async function computeSignature(signedPayload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  return "sha256=" + Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function verifyWebhookSignature({
  signedPayload,
  signature,
  secret,
}: {
  signedPayload: string;
  signature: string | null;
  secret: string;
}): Promise<boolean> {
  if (!signature) return false;
  const expected = await computeSignature(signedPayload, secret);
  return constantTimeEqual(signature, expected);
}

function parseTimestamp(timestamp: string): number {
  const numeric = Number(timestamp);
  if (Number.isFinite(numeric)) {
    if (Math.abs(numeric) < 1e12) {
      return numeric * 1000;
    }
    return numeric;
  }
  const parsed = Date.parse(timestamp);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  throw new WebhookError("invalid_timestamp", "Invalid webhook timestamp");
}

export async function verifyWebhookRequest({
  req,
  secret,
  signatureHeader = DEFAULT_SIGNATURE_HEADER,
  timestampHeader = DEFAULT_TIMESTAMP_HEADER,
  toleranceMs = DEFAULT_TOLERANCE_MS,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
}: {
  req: Request;
  secret: string;
  signatureHeader?: string;
  timestampHeader?: string;
  toleranceMs?: number;
  maxBodyBytes?: number;
}): Promise<{ body: string; payload: any; timestamp: string }> {
  const signature = req.headers.get(signatureHeader);
  const timestamp = req.headers.get(timestampHeader);
  if (!timestamp) {
    throw new WebhookError("missing_timestamp", "Missing webhook timestamp");
  }

  const timestampMs = parseTimestamp(timestamp);
  const skew = Math.abs(Date.now() - timestampMs);
  if (skew > toleranceMs) {
    throw new WebhookError("stale_timestamp", "Webhook timestamp outside tolerance window");
  }

  let body = '';
  if (typeof (req as any).text === 'function') {
    body = await (req as any).text();
  } else if ((req as any).raw && typeof (req as any).raw.text === 'function') {
    body = await (req as any).raw.text();
  } else {
    body = await new Response(req.body).text();
  }

  if (new TextEncoder().encode(body).length > maxBodyBytes) {
    throw new WebhookError("body_too_large", "Webhook body exceeds size limit");
  }

  const signedPayload = `${timestamp}.${body}`;
  const isValid = await verifyWebhookSignature({
    signedPayload,
    signature,
    secret,
  });

  if (!isValid) {
    throw new WebhookError("invalid_signature", "Invalid webhook signature");
  }

  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new WebhookError("invalid_json", "Invalid JSON in request body");
  }

  return { body, payload, timestamp };
}

export function parseEmailWebhookPayload(body: string): any {
  const parsed = JSON.parse(body);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid email webhook payload");
  }
  if (typeof parsed.version !== "string" || typeof parsed.type !== "string") {
    throw new Error("Invalid email webhook payload");
  }
  return parsed;
}
