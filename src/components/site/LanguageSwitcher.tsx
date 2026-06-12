import { useEffect, useState } from "react";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Lang = { code: "en" | "hi" | "mr"; label: string; native: string };

const LANGS: Lang[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

const STORAGE_KEY = "xcapital.lang";

export function LanguageSwitcher() {
  const [lang, setLang] = useState<Lang["code"]>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as Lang["code"])) || "en";
    setLang(saved);
    document.documentElement.lang = saved;
  }, []);

  const pick = (code: Lang["code"]) => {
    setLang(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
    window.dispatchEvent(new CustomEvent("languagechange", { detail: code }));
  };

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Change language. Current: ${current.label}`}
        className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full border border-[var(--brand-black)]/10 text-sm font-semibold text-[var(--brand-black)] hover:bg-[var(--brand-yellow-soft)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)]"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="uppercase tracking-wide">{current.code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => pick(l.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>
              <span className="font-medium">{l.native}</span>
              <span className="ml-2 text-xs text-muted-foreground">{l.label}</span>
            </span>
            {lang === l.code && <Check className="h-4 w-4 text-[var(--brand-black)]" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}