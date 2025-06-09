import { useTranslation } from "react-i18next";

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-card border-t">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-muted-foreground text-sm">
                    © {new Date().getFullYear()} MyApp. {t("footer.copyright")}
                </p>
            </div>
        </footer>
    );
};
