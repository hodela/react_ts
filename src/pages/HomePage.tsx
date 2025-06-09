import { SEO } from "@/components/shared/SEO";
import { generatePageTitle, generateWebsiteSchema } from "@/lib/seo-utils";
import { type FC } from "react";
import { useTranslation } from "react-i18next";

const HomePage: FC = () => {
    const { t } = useTranslation();
    const pageTitle = generatePageTitle(t("home.seo.title"));
    const websiteSchema = generateWebsiteSchema();

    return (
        <>
            <SEO
                title={pageTitle}
                description={t("home.seo.description")}
                keywords={t("home.seo.keywords")}
                schema={websiteSchema}
            />
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">{t("home.title")}</h1>
                    <p className="text-xl text-muted-foreground mb-8">{t("home.subtitle")}</p>
                </div>
            </div>
        </>
    );
};

export default HomePage;
