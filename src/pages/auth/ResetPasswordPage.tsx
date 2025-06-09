import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Eye, EyeOff, Lock, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { authService } from "@/api/services/auth.service";
import { SEO } from "@/components/shared/SEO";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import type { ApiError } from "@/types/api";

const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const seoData = generateAuthPageSEO("resetPassword", t);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    // Zod schema for form validation with i18n
    const resetPasswordSchema = z
        .object({
            password: z.string().min(6, t("auth.resetPassword.validation.passwordMinLength")),
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("auth.resetPassword.validation.passwordMismatch"),
            path: ["confirmPassword"],
        });

    type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError: setFieldError,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) return;

        setError("");

        try {
            await authService.resetPassword(
                {
                    token,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                },
                t
            );

            setSuccess(true);
        } catch (error) {
            const apiError = error as ApiError;

            // Xử lý validation errors từ API
            if (apiError.details) {
                Object.entries(apiError.details).forEach(([field, messages]) => {
                    if (Array.isArray(messages) && messages.length > 0) {
                        if (field === "token") {
                            setError(messages[0]);
                        } else {
                            setFieldError(field as keyof ResetPasswordFormData, {
                                message: messages[0],
                            });
                        }
                    }
                });
            } else {
                setError(apiError.message || t("auth.resetPassword.errors.resetPasswordFailed"));
            }
        }
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password">{t("auth.resetPassword.newPassword")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                {...register("password")}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder={t("auth.resetPassword.placeholders.newPassword")}
                                className="pl-10 pr-10"
                                disabled={isSubmitting}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                tabIndex={-1}
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t("auth.resetPassword.confirmNewPassword")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                {...register("confirmPassword")}
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t("auth.resetPassword.placeholders.confirmNewPassword")}
                                className="pl-10 pr-10"
                                disabled={isSubmitting}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                tabIndex={-1}
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isSubmitting}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? t("auth.resetPassword.resetting") : t("auth.resetPassword.resetButton")}
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
