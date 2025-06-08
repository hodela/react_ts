import { Mail } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";

const VerifyEmailPage = () => {
    const { t } = useTranslation();
    const seoData = generateAuthPageSEO("verifyEmail", t);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            navigate("/auth/verify-email-failed");
            return;
        }

        const verifyEmail = async () => {
            try {
                // TODO: Implement email verification logic
                await new Promise((resolve) => setTimeout(resolve, 2000));

                // Simulate verification result
                const isValid = Math.random() > 0.3; // 70% success rate for demo

                if (isValid) {
                    navigate("/auth/verify-email-success");
                } else {
                    navigate("/auth/verify-email-expired");
                }
            } catch (error) {
                navigate("/auth/verify-email-failed");
            }
        };

        verifyEmail();
    }, [token, navigate]);

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
                    <div className="relative">
                        <Mail className="h-16 w-16 text-muted-foreground" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold">{t("auth.verifyEmail.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("auth.verifyEmail.subtitle")}</p>
                </div>

                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>

                <p className="text-xs text-muted-foreground">
                    {t("auth.verifyEmail.waitingMessage")}{" "}
                    <Link to="/auth/login" className="text-primary hover:underline">
                        {t("auth.verifyEmail.backToLogin")}
                    </Link>
                </p>
            </div>
        </>
    );
};

export default VerifyEmailPage;
