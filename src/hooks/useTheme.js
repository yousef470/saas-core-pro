import { useContext } from "react";
import { ThemeContext } from "../context/AppContext"; // تأكد من المسار الصحيح

export function useTheme() {
  return useContext(ThemeContext);
}