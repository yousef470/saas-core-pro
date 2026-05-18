import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [rtl, setRtl] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    document.documentElement.dir = rtl
      ? "rtl"
      : "ltr";
  }, [darkMode, rtl]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        rtl,
        setRtl,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}