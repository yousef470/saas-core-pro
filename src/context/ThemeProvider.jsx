import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

import en from "../locales/en";
import ar from "../locales/ar";
export function ThemeProvider({ children }) {
const translations = {
  en,
  ar,
};

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || false
  );
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLang((prev) => (prev === "en" ? "ar" : "en"));

  const t = translations[lang];

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, lang, toggleLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
}