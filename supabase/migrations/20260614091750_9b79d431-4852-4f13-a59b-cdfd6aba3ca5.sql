CREATE OR REPLACE FUNCTION public.admin_email_queue_metrics()
RETURNS TABLE(
  queue_name TEXT,
  queue_length BIGINT,
  oldest_msg_age_sec INT,
  newest_msg_age_sec INT,
  total_messages BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pgmq
AS $$
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY
  SELECT m.queue_name::text, m.queue_length, m.oldest_msg_age_sec, m.newest_msg_age_sec, m.total_messages
  FROM pgmq.metrics_all() m;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_email_queue_metrics() TO authenticated;