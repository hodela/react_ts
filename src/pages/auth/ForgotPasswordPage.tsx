import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";

const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const seoData = generateAuthPageSEO("forgotPassword", t);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // TODO: Implement forgot password logic
        setTimeout(() => {
            setIsLoading(false);
            setError(t("auth.forgotPassword.errors.forgotPasswordFeatureInDevelopment"));
            // For demo, we'll show success instead
            setSuccess(true);
        }, 1000);
    };

    if (success) {
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
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-green-600">{t("auth.forgotPassword.success")}</h2>
                        <p className="text-muted-foreground mt-2">{t("auth.forgotPassword.checkEmail")}</p>
                    </div>

                    <div className="space-y-3">
                        <Button asChild className="w-full">
                            <Link to="/auth/login">{t("auth.forgotPassword.backToLogin")}</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                            <Link to="/">{t("navigation.home")}</Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO
                title={seoData.title}
                description={seoData.description}
                keywords={seoData.keywords}
                schema={seoData.schema}
            />
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">{t("auth.forgotPassword.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("auth.forgotPassword.subtitle")}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">{t("common.email")}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t("auth.forgotPassword.placeholders.email")}
                                className="pl-10"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t("auth.forgotPassword.sending") : t("auth.forgotPassword.sendReset")}
                    </Button>
                </form>

                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        <Link to="/auth/login" className="text-primary hover:underline">
                            {t("auth.forgotPassword.backToLogin")}
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;
