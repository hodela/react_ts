import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";
import { authService } from "@/api/services/auth.service";
import type { ApiError } from "@/types/api";

const VerifyEmailPage = () => {
    const { t } = useTranslation();
    const seoData = generateAuthPageSEO("verifyEmail", t);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [isVerifying, setIsVerifying] = useState(true);
    const [hasCheckedToken, setHasCheckedToken] = useState(false);

    useEffect(() => {
        // Đợi một tick để đảm bảo searchParams đã được parse đầy đủ
        const timeoutId = setTimeout(() => {
            if (!hasCheckedToken) {
                setHasCheckedToken(true);

                if (!token) {
                    navigate("/auth/verify-email-failed");
                    return;
                }

                const verifyEmail = async () => {
                    setIsVerifying(true);
                    try {
                        await authService.verifyEmail(token, t);
                        navigate("/auth/verify-email-success");
                    } catch (error) {
                        const apiError = error as ApiError;

                        // Xử lý các loại lỗi khác nhau
                        if (apiError.code === "TOKEN_EXPIRED") {
                            navigate("/auth/verify-email-expired");
                        } else {
                            navigate("/auth/verify-email-failed");
                        }
                    } finally {
                        setIsVerifying(false);
                    }
                };

                verifyEmail();
            }
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [token, navigate, t, hasCheckedToken]);

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

                {isVerifying && (
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    </div>
                )}

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
