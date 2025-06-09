import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderContextType = {
    theme: "system",
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderContextType>(initialState);

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
}) => {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
