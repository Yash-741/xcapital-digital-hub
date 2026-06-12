import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi" | "mr";
const STORAGE_KEY = "xcapital.lang";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.investments": "Investments",
  "nav.loans": "Loans",
  "nav.insurance": "Insurance",
  "nav.calculators": "Calculators",
  "nav.store": "Store",
  "nav.about": "About",
  "actions.callUs": "Call us",
  "actions.email": "Email",
  "actions.signOut": "Sign out",
  "actions.login": "Register / Login",
  "actions.loginShort": "Login",
  "hero.eyebrow": "Grow. Protect. Invest.",
  "hero.title": "Smarter money decisions for every Indian household",
  "hero.subtitle": "Loans, investments and insurance from India's leading banks & financial institutions — all under one trusted roof.",
  "hero.applyLoan": "Apply for a Loan",
  "hero.tryCalc": "Try our Calculators",
  "hero.partners": "50+ partner banks",
  "hero.disbursal": "Disbursal in 24 hrs",
  "hero.secure": "Secure & transparent",
  "section.investments": "Investments",
  "section.loans": "Loans",
  "section.insurance": "Insurance",
  "section.generalInsurance": "General Insurance",
  "section.calculators": "Calculators",
  "common.viewAll": "View all",
  "about.title": "We have your finances covered",
  "about.body": "Explore our diverse financial solutions — from high-yield deposits to versatile loans — built to power every milestone of your life.",
  "about.cta": "Explore Products",
  "footer.products": "Products",
  "footer.store": "Store",
  "footer.company": "Company",
  "footer.reachUs": "Reach Us",
  "footer.tagline": "Strategic banking, lending and treasury solutions for businesses, professionals and individuals.",
  "footer.rights": "All rights reserved.",
  "footer.disclaimer": "Disclaimer: Loan, investment and insurance products are subject to terms and conditions and regulatory approvals.",
  "lang.label": "Language",
};

const hi: Dict = {
  "nav.home": "होम",
  "nav.investments": "निवेश",
  "nav.loans": "लोन",
  "nav.insurance": "बीमा",
  "nav.calculators": "कैलकुलेटर",
  "nav.store": "स्टोर",
  "nav.about": "हमारे बारे में",
  "actions.callUs": "कॉल करें",
  "actions.email": "ईमेल",
  "actions.signOut": "साइन आउट",
  "actions.login": "रजिस्टर / लॉगिन",
  "actions.loginShort": "लॉगिन",
  "hero.eyebrow": "बढ़ाएँ. सुरक्षित करें. निवेश करें.",
  "hero.title": "हर भारतीय परिवार के लिए स्मार्ट वित्तीय फैसले",
  "hero.subtitle": "भारत के अग्रणी बैंकों और वित्तीय संस्थानों से लोन, निवेश और बीमा — सब एक भरोसेमंद जगह पर.",
  "hero.applyLoan": "लोन के लिए आवेदन करें",
  "hero.tryCalc": "कैलकुलेटर आज़माएँ",
  "hero.partners": "50+ साझेदार बैंक",
  "hero.disbursal": "24 घंटे में वितरण",
  "hero.secure": "सुरक्षित और पारदर्शी",
  "section.investments": "निवेश",
  "section.loans": "लोन",
  "section.insurance": "बीमा",
  "section.generalInsurance": "जनरल बीमा",
  "section.calculators": "कैलकुलेटर",
  "common.viewAll": "सभी देखें",
  "about.title": "आपकी वित्तीय ज़रूरतें हमारे साथ सुरक्षित",
  "about.body": "उच्च-ब्याज जमा से लेकर बहु-उपयोगी लोन तक — आपके जीवन के हर पड़ाव के लिए वित्तीय समाधान.",
  "about.cta": "उत्पाद देखें",
  "footer.products": "उत्पाद",
  "footer.store": "स्टोर",
  "footer.company": "कंपनी",
  "footer.reachUs": "संपर्क करें",
  "footer.tagline": "व्यवसायों, पेशेवरों और व्यक्तियों के लिए रणनीतिक बैंकिंग, ऋण और ट्रेज़री समाधान.",
  "footer.rights": "सर्वाधिकार सुरक्षित.",
  "footer.disclaimer": "अस्वीकरण: लोन, निवेश और बीमा उत्पाद शर्तों और नियामक स्वीकृतियों के अधीन हैं.",
  "lang.label": "भाषा",
};

const mr: Dict = {
  "nav.home": "मुख्यपृष्ठ",
  "nav.investments": "गुंतवणूक",
  "nav.loans": "कर्ज",
  "nav.insurance": "विमा",
  "nav.calculators": "कॅल्क्युलेटर",
  "nav.store": "स्टोअर",
  "nav.about": "आमच्याबद्दल",
  "actions.callUs": "कॉल करा",
  "actions.email": "ईमेल",
  "actions.signOut": "साइन आउट",
  "actions.login": "नोंदणी / लॉगिन",
  "actions.loginShort": "लॉगिन",
  "hero.eyebrow": "वाढवा. सुरक्षित करा. गुंतवा.",
  "hero.title": "प्रत्येक भारतीय कुटुंबासाठी सुज्ञ आर्थिक निर्णय",
  "hero.subtitle": "भारतातील आघाडीच्या बँका आणि वित्तीय संस्थांकडून कर्ज, गुंतवणूक आणि विमा — एकाच विश्वासू ठिकाणी.",
  "hero.applyLoan": "कर्जासाठी अर्ज करा",
  "hero.tryCalc": "कॅल्क्युलेटर वापरून पहा",
  "hero.partners": "50+ भागीदार बँका",
  "hero.disbursal": "24 तासांत वितरण",
  "hero.secure": "सुरक्षित आणि पारदर्शक",
  "section.investments": "गुंतवणूक",
  "section.loans": "कर्ज",
  "section.insurance": "विमा",
  "section.generalInsurance": "जनरल विमा",
  "section.calculators": "कॅल्क्युलेटर",
  "common.viewAll": "सर्व पहा",
  "about.title": "तुमची आर्थिक काळजी आमच्यासोबत",
  "about.body": "उच्च-व्याज ठेवींपासून ते बहुउपयोगी कर्जांपर्यंत — तुमच्या आयुष्याच्या प्रत्येक टप्प्यासाठी आर्थिक उपाय.",
  "about.cta": "उत्पादने पहा",
  "footer.products": "उत्पादने",
  "footer.store": "स्टोअर",
  "footer.company": "कंपनी",
  "footer.reachUs": "संपर्क",
  "footer.tagline": "व्यवसाय, व्यावसायिक आणि व्यक्तींसाठी धोरणात्मक बँकिंग, कर्ज आणि ट्रेझरी उपाय.",
  "footer.rights": "सर्व हक्क राखीव.",
  "footer.disclaimer": "अस्वीकरण: कर्ज, गुंतवणूक आणि विमा उत्पादने अटी व नियामक मंजुरीच्या अधीन आहेत.",
  "lang.label": "भाषा",
};

const DICTS: Record<Lang, Dict> = { en, hi, mr };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as Lang)) || "en";
    setLangState(saved);
    if (typeof document !== "undefined") document.documentElement.lang = saved;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  }, []);

  const t = useCallback((key: string) => DICTS[lang][key] ?? DICTS.en[key] ?? key, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: string) => DICTS.en[k] ?? k };
  return ctx;
}