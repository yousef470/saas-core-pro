import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // تأكد من المسار الصحيح

export function useTheme() {
  return useContext(ThemeContext);
}