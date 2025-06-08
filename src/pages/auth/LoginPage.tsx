import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { SEO } from "@/components/shared/SEO";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateAuthPageSEO } from "@/lib/seo-utils";

const LoginPage = () => {
    const { t } = useTranslation();
    const seoData = generateAuthPageSEO("login", t);

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // TODO: Implement login logic
        setTimeout(() => {
            setIsLoading(false);
            setError(t("auth.login.errors.loginFeatureInDevelopment"));
        }, 1000);
    };

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
                    <h2 className="text-2xl font-bold">{t("auth.login.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("auth.login.subtitle")}</p>
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
                                placeholder={t("auth.login.placeholders.email")}
                                className="pl-10"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{t("common.password")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder={t("auth.login.placeholders.password")}
                                className="pl-10 pr-10"
                                required
                                disabled={isLoading}
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

                    <div className="flex justify-end">
                        <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                            {t("auth.login.forgotPassword")}
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t("auth.login.signingIn") : t("auth.login.signInButton")}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    {t("auth.login.noAccount")}{" "}
                    <Link to="/auth/register" className="font-medium text-primary hover:underline">
                        {t("auth.login.signUp")}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
