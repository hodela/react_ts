import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export type Language = "en" | "vi" | string;

export const useLanguage = () => {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.language as Language;

    const changeLanguage = useCallback(
        (lng: Language) => {
            i18n.changeLanguage(lng);
            // Store the user's language preference
            localStorage.setItem("userLanguage", lng);
        },
        [i18n]
    );

    const getUserLanguagePreference = useCallback((): Language => {
        const stored = localStorage.getItem("userLanguage") as Language;
        return stored || "en";
    }, []);

    const setUserLanguagePreference = useCallback(
        (lng: Language) => {
            localStorage.setItem("userLanguage", lng);
            changeLanguage(lng);
        },
        [changeLanguage]
    );

    return {
        currentLanguage,
        changeLanguage,
        getUserLanguagePreference,
        setUserLanguagePreference,
    };
};
