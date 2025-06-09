import { AlertTriangle, Eye, EyeOff, Lock, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { userService } from "@/api/services/user.service";
import { SEO } from "@/components/shared/SEO";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAuth } from "@/hooks/useAuth";
import { generateKeywords, generateMetaDescription, generatePageTitle, generateWebsiteSchema } from "@/lib/seo-utils";
import { useTheme } from "@/providers/ThemeProvider";
import type { ApiError } from "@/types/api";
import { toast } from "sonner";
import { tokenManager } from "@/lib/tokenManager";

const SettingsPage = () => {
    const { t, i18n } = useTranslation();
    const { user, refreshUser } = useAuth();
    const { setTheme } = useTheme();
    const navigate = useNavigate();
    const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);
    const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const seoTitle = generatePageTitle(t("settings.seo.title"), t);
    const seoDescription = generateMetaDescription(t("settings.seo.description"));
    const seoKeywords = generateKeywords([t("settings.seo.keywords")]);
    const seoSchema = generateWebsiteSchema(t);

    // Schema for delete account form
    const deleteAccountSchema = z.object({
        password: z.string().min(1, t("settings.dangerZone.passwordRequired")),
    });

    type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DeleteAccountFormData>({
        resolver: zodResolver(deleteAccountSchema),
    });

    const handleLanguageChange = async (language: "vi" | "en") => {
        if (language === user?.language) return;
        setIsUpdatingLanguage(true);

        try {
            await userService.updateLanguage(language, t);
            await refreshUser();
            i18n.changeLanguage(language);
            toast.success(t("settings.languageUpdated"));
        } catch (error) {
            const apiError = error as ApiError;
            toast.error(apiError.message || t("settings.updateFailed"));
        } finally {
            setIsUpdatingLanguage(false);
        }
    };

    const handleThemeChange = async (theme: "light" | "dark" | "system") => {
        if (theme === user?.theme) return;

        setIsUpdatingTheme(true);

        try {
            await userService.updateTheme(theme, t);
            await refreshUser();
            setTheme(theme);
            toast.success(t("settings.themeUpdated"));
        } catch (error) {
            const apiError = error as ApiError;
            toast.error(apiError.message || t("settings.updateFailed"));
        } finally {
            setIsUpdatingTheme(false);
        }
    };

    const onDeleteAccount = async (data: DeleteAccountFormData) => {
        setIsDeletingAccount(true);

        try {
            await userService.deleteAccount(data.password, t);
            toast.success(t("settings.dangerZone.deleteSuccess"));
            tokenManager.clearTokens();
            reset();
            setShowDeleteDialog(false);
            navigate("/auth/login", { replace: true });
        } catch (error) {
            const apiError = error as ApiError;
            if (apiError.details?.password) {
                toast.error(apiError.details.password);
            } else {
                toast.error(apiError.message || t("settings.deleteFailed"));
            }
            // Modal không bị đóng khi có lỗi
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const handleDeleteAccount = () => {
        handleSubmit(onDeleteAccount)();
    };

    useEffect(() => {
        refreshUser();
    }, []);

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
                <Card>
                    <CardHeader className="px-10 py-8">
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            {t("settings.title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 px-10 pb-10 pt-0">
                        {/* Language Settings */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="language">{t("settings.language.choose")}</Label>
                                <Select
                                    disabled={isUpdatingLanguage}
                                    value={user?.language || "vi"}
                                    onValueChange={(value) => handleLanguageChange(value as "vi" | "en")}
                                >
                                    <SelectTrigger id="language">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                                        <SelectItem value="en">English</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">{t("settings.language.description")}</p>
                            </div>
                        </div>

                        {/* Theme Settings */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">{t("settings.theme.choose")}</Label>
                                <Select
                                    disabled={isUpdatingTheme}
                                    value={user?.theme || "system"}
                                    onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "system")}
                                >
                                    <SelectTrigger id="theme">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">{t("settings.theme.light")}</SelectItem>
                                        <SelectItem value="dark">{t("settings.theme.dark")}</SelectItem>
                                        <SelectItem value="system">{t("settings.theme.system")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">{t("settings.theme.description")}</p>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="space-y-4 pt-6 border-t border-border">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                <h3 className="text-lg font-semibold text-destructive">
                                    {t("settings.dangerZone.title")}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                                    <h4 className="font-medium text-destructive mb-2">
                                        {t("settings.dangerZone.deleteAccountTitle")}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {t("settings.dangerZone.deleteAccountDescription")}
                                    </p>

                                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" size="sm" disabled={isDeletingAccount}>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                {t("settings.dangerZone.deleteAccount")}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{t("settings.dangerZone.confirmTitle")}</DialogTitle>
                                                <DialogDescription>
                                                    {t("settings.dangerZone.confirmDescription")}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <form onSubmit={handleSubmit(onDeleteAccount)} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="password">
                                                        {t("settings.dangerZone.enterPassword")}
                                                    </Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            {...register("password")}
                                                            id="password"
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder={t("settings.dangerZone.passwordPlaceholder")}
                                                            disabled={isDeletingAccount}
                                                            className="pl-10 pr-10"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            tabIndex={-1}
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            disabled={isDeletingAccount}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                            ) : (
                                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    {errors.password && (
                                                        <p className="text-sm text-destructive">
                                                            {errors.password.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <DialogFooter>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        disabled={isDeletingAccount}
                                                        onClick={() => setShowDeleteDialog(false)}
                                                    >
                                                        {t("common.cancel")}
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={isDeletingAccount}
                                                        variant="destructive"
                                                        onClick={handleDeleteAccount}
                                                    >
                                                        {isDeletingAccount
                                                            ? t("settings.dangerZone.deleting")
                                                            : t("settings.dangerZone.confirmDelete")}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default SettingsPage;
