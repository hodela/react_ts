import { type FC } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, type Language } from "@/hooks/useLanguage";

interface LanguageSelectorProps {
    variant?: "default" | "ghost" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
    showLabel?: boolean;
}

const languages = [
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "vi" as Language, name: "Tiếng Việt", flag: "🇻🇳" },
];

export const LanguageSelector: FC<LanguageSelectorProps> = ({ variant = "ghost", size = "sm", showLabel = true }) => {
    const { currentLanguage, changeLanguage } = useLanguage();

    const currentLang = languages.find((lang) => lang.code === currentLanguage);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} className="gap-2 w-full lg:w-auto">
                    {currentLang?.flag}
                    {showLabel && <span>{currentLang?.name}</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`cursor-pointer ${currentLanguage === language.code ? "bg-accent" : ""}`}
                    >
                        <span className="mr-2">{language.flag}</span>
                        {language.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
