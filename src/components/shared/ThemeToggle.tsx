import { useEffect, useState, type FC } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { userService } from "@/api/services/user.service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { useLocation } from "react-router-dom";

interface ThemeToggleProps {
    variant?: "default" | "ghost" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
    showLabel?: boolean;
}

export const ThemeToggle: FC<ThemeToggleProps> = ({ variant = "ghost", size = "sm", showLabel = true }) => {
    const [isMounted, setIsMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();
    const { user, refreshUser, isAuthenticated } = useAuth();
    const location = useLocation();
    const themeOptions = [
        {
            value: "light" as const,
            label: t("theme.light", "Sáng"),
            icon: Sun,
        },
        {
            value: "dark" as const,
            label: t("theme.dark", "Tối"),
            icon: Moon,
        },
        {
            value: "system" as const,
            label: t("theme.system", "Hệ thống"),
            icon: Monitor,
        },
    ];

    const currentTheme = themeOptions.find((option) => option.value === theme);
    const CurrentIcon = currentTheme?.icon || Sun;

    // update user theme if user is logged in
    useEffect(() => {
        if (location.pathname !== "/account/settings" && user?.theme !== theme && isMounted && isAuthenticated) {
            console.log("update theme", theme);
            userService
                .updateTheme(theme, t)
                .then(() => {
                    toast.success(t("settings.themeUpdated"));
                })
                .catch((error) => {
                    const apiError = error as ApiError;
                    toast.error(apiError.message || t("settings.updateFailed"));
                })
                .finally(() => {
                    refreshUser();
                });
        }
    }, [theme, user?.theme, location, isMounted, isAuthenticated]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} className="gap-2 w-full lg:w-auto">
                    <CurrentIcon className="h-4 w-4" />
                    {showLabel && <span>{currentTheme?.label}</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`cursor-pointer ${theme === option.value ? "bg-accent" : ""}`}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {option.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
