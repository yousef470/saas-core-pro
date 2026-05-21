import { useContext } from "react";
// التعديل هنا: غيرنا اسم الملف لـ ThemeContext
import { ThemeContext } from "../context/ThemeContext"; 

const useTheme = () => {
  return useContext(ThemeContext);
};

export default useTheme;