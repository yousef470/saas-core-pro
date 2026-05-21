import { createContext, useState, useEffect } from "react";

// 1. هنعمل الـ Context هنا بس مش هنصدره (مش هنعمله export من هنا)
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [rtl, setRtl] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
  }, [darkMode]);
  console.log("darkMode:", darkMode);

  useEffect(() => {
    if (rtl) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [rtl]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, rtl, setRtl }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 2. هنصدرهم هما الاتنين تحت هنا في آخر الملف عشان الـ ESLint يرتاح
export { ThemeContext };
export default ThemeProvider;