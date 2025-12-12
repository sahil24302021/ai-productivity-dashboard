import { useEffect, useState, ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useState("light"); // we add Zustand later

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
