import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";

function useTheme() {
  return useContext(ThemeContext);
}

export default useTheme;

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function useTheme() {
  return useContext(ThemeContext);
}