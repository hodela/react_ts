import { type FC, type ReactNode, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { setUserLanguagePreference, getUserLanguagePreference } = useLanguage();

  useEffect(() => {
    if (isAuthenticated && user?.language) {
      // If user is logged in and has a language preference, use it
      setUserLanguagePreference(user.language);
    } else {
      // If user is not logged in, use stored language preference or default
      const storedLanguage = getUserLanguagePreference();
      setUserLanguagePreference(storedLanguage);
    }
  }, [isAuthenticated, user?.language, setUserLanguagePreference, getUserLanguagePreference]);

  return <>{children}</>;
};