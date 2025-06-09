import { type FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { generatePageTitle, generateWebsiteSchema } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";
import { Button } from "@/components/ui/button";

const NotFoundPage: FC = () => {
    const { t } = useTranslation();
    const pageTitle = generatePageTitle(t("notFoundPage.title"));
    const websiteSchema = generateWebsiteSchema();

    return (
        <>
            <SEO
                title={pageTitle}
                description={t("notFoundPage.seo.description")}
                keywords={t("notFoundPage.seo.keywords")}
                schema={websiteSchema}
            />
            <div className="min-h-screen bg-muted dark:bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <h1 className="text-9xl font-bold text-foreground">{t("notFoundPage.heading")}</h1>
                    <h2 className="text-3xl font-bold text-muted-foreground mb-4">{t("notFoundPage.subtitle")}</h2>
                    <p className="text-muted-foreground mb-8">{t("notFoundPage.message")}</p>
                    <Button asChild>
                        <Link to="/">{t("notFoundPage.backToHome")}</Link>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;
