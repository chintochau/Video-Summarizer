import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext();

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  const [isSideBarOpening, setIsSideBarOpening] = useState(() => {
    return localStorage.getItem("sidebar") || true;
  })

  useEffect(() => {
    // dartktheme, To be implemented
    return
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.getItem("sidebar") === "true" ? setIsSideBarOpening(true) : setIsSideBarOpening(false);
  }, [])
  

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    isSideBarOpening,
    setIsSideBarOpening: (isSideBarOpening) => {
      localStorage.setItem("sidebar", isSideBarOpening);
      setIsSideBarOpening(isSideBarOpening);
    }


  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
