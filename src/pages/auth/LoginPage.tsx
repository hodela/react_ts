import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { SEO } from "@/components/shared/SEO";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import type { ApiError } from "@/types/api";

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const seoData = generateAuthPageSEO("login", t);
    const { login, loginError, isLoggingIn, isAuthenticated } = useAuth();

    // Lấy message từ state nếu có
    const successMessage = location.state?.message;

    // Zod schema for form validation with i18n
    const loginSchema = z.object({
        email: z.string().email(t("auth.login.validation.emailInvalid")),
        password: z.string().min(1, t("auth.login.validation.passwordRequired")),
    });

    type LoginFormData = z.infer<typeof loginSchema>;

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError: setFieldError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            login({
                email: data.email,
                password: data.password,
            });
        } catch (error) {
            const apiError = error as ApiError;
            // Xử lý validation errors từ API
            if (apiError.details) {
                Object.entries(apiError.details).forEach(([field, messages]) => {
                    if (Array.isArray(messages) && messages.length > 0) {
                        setFieldError(field as keyof LoginFormData, {
                            message: messages[0],
                        });
                    }
                });
            } else {
                setFieldError("email", {
                    message: apiError.message || t("auth.login.errors.loginFailed"),
                });
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", {
                replace: true,
            });
        }
    }, [isAuthenticated, navigate]);

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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {successMessage && (
                        <Alert variant="success">
                            <AlertDescription className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {successMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {loginError && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {loginError.details?.email || loginError.message}
                                {loginError.code === "EMAIL_NOT_VERIFIED" && (
                                    <Link
                                        to="/auth/resend-verification"
                                        className="text-sm text-primary hover:underline px-2"
                                        tabIndex={-1}
                                    >
                                        ({t("auth.login.resendVerification")})
                                    </Link>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">{t("common.email")}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder={t("auth.login.placeholders.email")}
                                className="pl-10"
                                disabled={isLoggingIn}
                            />
                        </div>
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}

                    <div className="space-y-2">
                        <Label htmlFor="password">{t("common.password")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                {...register("password")}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder={t("auth.login.placeholders.password")}
                                className="pl-10 pr-10"
                                disabled={isLoggingIn}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                tabIndex={-1}
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoggingIn}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>

                    <div className="flex justify-end">
                        <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline" tabIndex={-1}>
                            {t("auth.login.forgotPassword")}
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoggingIn}>
                        {isLoggingIn ? t("auth.login.signingIn") : t("auth.login.signInButton")}
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
