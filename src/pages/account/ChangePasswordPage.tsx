import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { userService } from "@/api/services/user.service";
import { SEO } from "@/components/shared/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateKeywords, generateMetaDescription, generatePageTitle, generateWebsiteSchema } from "@/lib/seo-utils";
import type { ApiError, ChangePasswordRequest } from "@/types/api";
import { toast } from "sonner";

const ChangePasswordPage = () => {
    const { t } = useTranslation();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const seoTitle = generatePageTitle(t("changePassword.seo.title"), t);
    const seoDescription = generateMetaDescription(t("changePassword.seo.description"));
    const seoKeywords = generateKeywords([t("changePassword.seo.keywords")]);
    const seoSchema = generateWebsiteSchema(t);

    // Zod schema for form validation
    const changePasswordSchema = z
        .object({
            currentPassword: z.string().min(1, t("changePassword.validation.currentPasswordRequired")),
            newPassword: z.string().min(6, t("changePassword.validation.newPasswordMinLength")),
            confirmPassword: z.string().min(1, t("changePassword.validation.confirmPasswordRequired")),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t("changePassword.validation.passwordsNotMatch"),
            path: ["confirmPassword"],
        });

    type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError: setFieldError,
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            const changePasswordData: ChangePasswordRequest = {
                oldPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            };

            await userService.changePassword(changePasswordData, t);
            toast.success(t("changePassword.success"));
            reset();
        } catch (error) {
            const apiError = error as ApiError;

            if (apiError.details) {
                Object.entries(apiError.details).forEach(([field, messages]) => {
                    if (Array.isArray(messages) && messages.length > 0) {
                        setFieldError(field as keyof ChangePasswordFormData, {
                            message: messages[0],
                        });
                    }
                });
            } else {
                toast.error(apiError.message || t("changePassword.failed"));
            }
        }
    };

    return (
        <>
            <SEO
                title={seoTitle}
                description={seoDescription}
                keywords={seoKeywords}
                schema={seoSchema}
                robots="noindex, nofollow"
            />
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Card className="shadow-xl">
                    <CardHeader className="px-10 py-8">
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            {t("changePassword.title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 px-10 pb-10 pt-0">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">{t("changePassword.currentPassword")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("currentPassword")}
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder={t("changePassword.placeholders.currentPassword")}
                                        disabled={isSubmitting}
                                        className="pl-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        tabIndex={-1}
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        disabled={isSubmitting}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.currentPassword && (
                                    <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">{t("changePassword.newPassword")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("newPassword")}
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder={t("changePassword.placeholders.newPassword")}
                                        disabled={isSubmitting}
                                        className="pl-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        tabIndex={-1}
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        disabled={isSubmitting}
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {t("changePassword.passwordRequirements")}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">{t("changePassword.confirmPassword")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("confirmPassword")}
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder={t("changePassword.placeholders.confirmPassword")}
                                        disabled={isSubmitting}
                                        className="pl-10"
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
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? t("changePassword.changing") : t("changePassword.change")}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default ChangePasswordPage;
