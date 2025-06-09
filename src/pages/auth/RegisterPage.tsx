import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";
import { authService } from "@/api/services/auth.service";
import type { ApiError } from "@/types/api";

const RegisterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const seoData = generateAuthPageSEO("register", t);

    // Zod schema for form validation with i18n
    const registerSchema = z
        .object({
            name: z.string().min(1, t("auth.register.validation.nameRequired")),
            email: z.string().email(t("auth.register.validation.emailInvalid")),
            password: z.string().min(6, t("auth.register.validation.passwordMinLength")),
            confirmPassword: z.string(),
            agreedToTerms: z.boolean().refine((val) => val === true, t("auth.register.validation.termsRequired")),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("auth.register.validation.passwordMismatch"),
            path: ["confirmPassword"],
        });

    type RegisterFormData = z.infer<typeof registerSchema>;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setError: setFieldError,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreedToTerms: false,
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setError("");

        try {
            // Gọi register service
            const response = await authService.register(
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                },
                t
            );

            // Nếu đăng ký thành công, điều hướng về trang login
            if (response.requiresVerification) {
                // Hiển thị thông báo cần xác thực email
                navigate("/auth/login", {
                    state: {
                        message: t("auth.register.success.verificationRequired"),
                    },
                });
            } else {
                navigate("/auth/login", {
                    state: {
                        message: t("auth.register.success.accountCreated"),
                    },
                });
            }
        } catch (error) {
            const apiError = error as ApiError;

            // Xử lý validation errors từ API
            if (apiError.details) {
                Object.entries(apiError.details).forEach(([field, messages]) => {
                    if (Array.isArray(messages) && messages.length > 0) {
                        setFieldError(field as keyof RegisterFormData, {
                            message: messages[0],
                        });
                    }
                });
            } else {
                setError(apiError.message || t("auth.register.errors.registerFailed"));
            }
        }
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">{t("common.name")}</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                {...register("name")}
                                id="name"
                                type="text"
                                placeholder={t("auth.register.placeholders.name")}
                                className="pl-10"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

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
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>

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
                        <Label htmlFor="confirmPassword">{t("auth.register.confirmPassword")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                {...register("confirmPassword")}
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t("auth.register.placeholders.confirmPassword")}
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

                    <div className="flex items-center space-x-2">
                        <Controller
                            name="agreedToTerms"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="terms"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                        <Label htmlFor="terms" className="text-sm">
                            {t("auth.register.agreeToTerms")}{" "}
                            <Link to="/terms" className="text-primary hover:underline" tabIndex={-1}>
                                {t("auth.register.termsOfService")}
                            </Link>
                        </Label>
                    </div>
                    {errors.agreedToTerms && <p className="text-sm text-destructive">{errors.agreedToTerms.message}</p>}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? t("auth.register.signingUp") : t("auth.register.signUpButton")}
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
