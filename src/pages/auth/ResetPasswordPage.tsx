import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";

const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const seoData = generateAuthPageSEO("resetPassword", t);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError(t("auth.resetPassword.errors.passwordMismatch"));
            setIsLoading(false);
            return;
        }

        // TODO: Implement reset password logic
        setTimeout(() => {
            setIsLoading(false);
            setError(t("auth.resetPassword.errors.resetPasswordFeatureInDevelopment"));
            // For demo, we'll show success instead
            setSuccess(true);
        }, 1000);
    };

    if (!token) {
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
                        <h2 className="text-2xl font-bold text-red-600">
                            {t("auth.resetPassword.errors.invalidToken")}
                        </h2>
                        <p className="text-muted-foreground mt-2">{t("auth.resetPassword.invalidTokenMessage")}</p>
                    </div>

                    <Button asChild className="w-full">
                        <Link to="/auth/forgot-password">{t("auth.forgotPassword.sendReset")}</Link>
                    </Button>
                </div>
            </>
        );
    }

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
                        <h2 className="text-2xl font-bold text-green-600">{t("common.success")}</h2>
                        <p className="text-muted-foreground mt-2">{t("auth.resetPassword.success")}</p>
                    </div>

                    <Button asChild className="w-full">
                        <Link to="/auth/login">{t("auth.resetPassword.backToLogin")}</Link>
                    </Button>
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
                    <h2 className="text-2xl font-bold">{t("auth.resetPassword.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("auth.resetPassword.subtitle")}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password">{t("auth.resetPassword.newPassword")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder={t("auth.resetPassword.placeholders.newPassword")}
                                className="pl-10 pr-10"
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t("auth.resetPassword.confirmNewPassword")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t("auth.resetPassword.placeholders.confirmNewPassword")}
                                className="pl-10 pr-10"
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t("auth.resetPassword.resetting") : t("auth.resetPassword.resetButton")}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    <Link to="/auth/login" className="text-primary hover:underline">
                        {t("auth.resetPassword.backToLogin")}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ResetPasswordPage;
