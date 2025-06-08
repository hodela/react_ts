import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";

const VerifyEmailFailedPage = () => {
    const { t } = useTranslation();
    const seoData = generateAuthPageSEO("verifyEmailFailed", t);

    return (
        <>
            <SEO
                title={seoData.title}
                description={seoData.description}
                keywords={seoData.keywords}
                schema={seoData.schema}
            />
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-red-600">{t("auth.verifyEmailFailed.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("auth.verifyEmailFailed.subtitle")}</p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm">{t("auth.verifyEmailFailed.message")}</p>

                    <div className="space-y-3">
                        <Button asChild className="w-full">
                            <Link to="/auth/resend-verification">{t("auth.verifyEmailFailed.requestNewLink")}</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                            <Link to="/auth/login">{t("auth.verifyEmailFailed.backToLogin")}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyEmailFailedPage;
