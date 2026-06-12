import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, type Lang } from "@/lib/i18n";

type LangOpt = { code: Lang; label: string; native: string };

const LANGS: LangOpt[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
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
        <DropdownMenuLabel>{t("lang.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLang(l.code)}
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