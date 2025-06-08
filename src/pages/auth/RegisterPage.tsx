import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";

const RegisterPage = () => {
    const { t } = useTranslation();
    const seoData = generateAuthPageSEO("register", t);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!agreedToTerms) {
            setError(t("auth.register.errors.termsRequired"));
            setIsLoading(false);
            return;
        }

        // TODO: Implement register logic
        setTimeout(() => {
            setIsLoading(false);
            setError(t("auth.register.errors.registerFeatureInDevelopment"));
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
                    <h2 className="text-2xl font-bold">{t("auth.register.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("auth.register.subtitle")}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">{t("common.name")}</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder={t("auth.register.placeholders.name")}
                                className="pl-10"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t("auth.register.confirmPassword")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t("auth.register.placeholders.confirmPassword")}
                                className="pl-10 pr-10"
                                required
                                disabled={isLoading}
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

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={agreedToTerms}
                            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                            disabled={isLoading}
                        />
                        <Label htmlFor="terms" className="text-sm">
                            {t("auth.register.agreeToTerms")}{" "}
                            <Link to="/terms" className="text-primary hover:underline">
                                {t("auth.register.termsOfService")}
                            </Link>
                        </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || !agreedToTerms}>
                        {isLoading ? t("auth.register.signingUp") : t("auth.register.signUpButton")}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    {t("auth.register.haveAccount")}{" "}
                    <Link to="/auth/login" className="font-medium text-primary hover:underline">
                        {t("auth.register.signIn")}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
