import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Mail, Save, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { userService } from "@/api/services/user.service";
import { SEO } from "@/components/shared/SEO";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/user/AvatarUpload";
import { useAuth } from "@/hooks/useAuth";
import { getAvatarUrl, getAvatarFallback } from "@/lib/imageUtils";
import { generateKeywords, generateMetaDescription, generatePageTitle, generateWebsiteSchema } from "@/lib/seo-utils";
import type { ApiError, UpdateProfileRequest } from "@/types/api";
import { toast } from "sonner";

const AccountInfoPage = () => {
    const { t } = useTranslation();
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const seoTitle = generatePageTitle(t("account.seo.title"), t);
    const seoDescription = generateMetaDescription(t("account.seo.description"));
    const seoKeywords = generateKeywords([t("account.seo.keywords")]);
    const seoSchema = generateWebsiteSchema(t);

    // Zod schema for form validation
    const updateProfileSchema = z.object({
        name: z.string().min(1, t("account.validation.nameRequired")).max(100, t("account.validation.nameMaxLength")),
        email: z.string().min(1, t("account.validation.emailRequired")).email(t("account.validation.emailInvalid")),
    });

    type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError: setFieldError,
        reset,
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    });

    const onSubmit = async (data: UpdateProfileFormData) => {
        try {
            const updateData: UpdateProfileRequest = {
                name: data.name,
            };

            await userService.updateProfile(updateData, t);
            await refreshUser();
            setIsEditing(false);
            toast.success(t("account.updateSuccess"));
        } catch (error) {
            const apiError = error as ApiError;

            if (apiError.details) {
                Object.entries(apiError.details).forEach(([field, messages]) => {
                    if (Array.isArray(messages) && messages.length > 0) {
                        setFieldError(field as keyof UpdateProfileFormData, {
                            message: messages[0],
                        });
                    }
                });
            } else {
                toast.error(apiError.message || t("account.updateFailed"));
            }
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        reset({
            name: user?.name || "",
            email: user?.email || "",
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset();
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
                            <User className="h-5 w-5" />
                            {t("account.title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 px-10 pb-10 pt-0">
                        {/* Avatar Upload Section */}
                        {isEditing && <AvatarUpload />}

                        {!isEditing && (
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={getAvatarUrl(user?.avatar) || undefined} alt={user?.name} />
                                    <AvatarFallback>{getAvatarFallback(user?.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{user?.name}</h3>
                                    <p className="text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t("common.name")}</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register("name")}
                                        id="name"
                                        type="text"
                                        disabled={!isEditing || isSubmitting}
                                        placeholder={t("account.placeholders.name")}
                                        className="pl-10"
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
                                        disabled={true}
                                        placeholder={t("account.placeholders.email")}
                                        className="bg-muted pl-10"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">{t("account.emailCannotChange")}</p>
                            </div>

                            <div className="flex gap-2 pt-4">
                                {!isEditing ? (
                                    <Button type="button" onClick={handleEdit}>
                                        <Edit className="h-4 w-4" />
                                        {t("account.edit")}
                                    </Button>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                                        <Button type="submit" disabled={isSubmitting}>
                                            <Save className="h-4 w-4" />
                                            {isSubmitting ? t("account.saving") : t("account.save")}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={isSubmitting}
                                        >
                                            {t("common.cancel")}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AccountInfoPage;
