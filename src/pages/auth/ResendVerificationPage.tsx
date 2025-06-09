import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateAuthPageSEO } from "@/lib/seo-utils";
import { SEO } from "@/components/shared/SEO";
import { authService } from "@/api/services/auth.service";
import type { ApiError } from "@/types/api";

const ResendVerificationPage = () => {
    const { t } = useTranslation();
    const seoData = generateAuthPageSEO("resendVerification", t);

    // Zod schema for form validation with i18n
    const resendVerificationSchema = z.object({
        email: z
            .string()
            .min(1, t("auth.resendVerification.validation.emailRequired"))
            .email(t("auth.resendVerification.validation.emailInvalid")),
    });

    type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;

    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError: setFieldError,
    } = useForm<ResendVerificationFormData>({
        resolver: zodResolver(resendVerificationSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ResendVerificationFormData) => {
        setError("");

        try {
            await authService.resendVerification(data.email, t);
            setIsSuccess(true);
        } catch (error) {
            const apiError = error as ApiError;

            // Xử lý validation errors từ API
            if (apiError.details) {
                Object.entries(apiError.details).forEach(([field, messages]) => {
                    if (Array.isArray(messages) && messages.length > 0) {
                        setFieldError(field as keyof ResendVerificationFormData, {
                            message: messages[0],
                        });
                    }
                });
            } else {
                setError(apiError.message || t("auth.resendVerification.errors.sendFailed"));
            }
        }
    };

    if (isSuccess) {
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
                        <h2 className="text-2xl font-bold text-green-600">
                            {t("auth.resendVerification.success.title")}
                        </h2>
                        <p className="text-muted-foreground mt-2">{t("auth.resendVerification.success.message")}</p>
                    </div>

                    <div className="space-y-3">
                        <Button asChild className="w-full">
                            <Link to="/auth/login">{t("auth.resendVerification.backToLogin")}</Link>
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
                    <h2 className="text-2xl font-bold">{t("auth.resendVerification.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("auth.resendVerification.subtitle")}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
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
                                placeholder={t("auth.resendVerification.form.emailPlaceholder")}
                                className="pl-10"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting
                            ? t("auth.resendVerification.form.sendingButton")
                            : t("auth.resendVerification.form.sendButton")}
                    </Button>
                </form>

                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        <Link to="/auth/login" className="text-primary hover:underline">
                            {t("auth.resendVerification.backToLogin")}
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default ResendVerificationPage;
