import { Camera, Trash2, Upload, User, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { userService } from "@/api/services/user.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { getAvatarFallback, getAvatarUrl } from "@/lib/imageUtils";
import type { ApiError } from "@/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvatarUploadProps {
    className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ className }) => {
    const { t } = useTranslation();
    const { user, refreshUser } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const file = files[0];

            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error(t("settings.avatar.invalidFileType"));
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast.error(t("settings.avatar.fileTooLarge"));
                return;
            }

            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Upload file
            setIsUploading(true);
            try {
                const response = await userService.uploadAvatar(file, t);
                await refreshUser();
                toast.success(response.message || t("settings.avatar.uploadSuccess"));
                setPreviewUrl(null);
            } catch (error) {
                const apiError = error as ApiError;
                toast.error(apiError.message || t("settings.avatar.uploadFailed"));
                setPreviewUrl(null);
            } finally {
                setIsUploading(false);
            }
        },
        [t, refreshUser]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFileSelect(e.dataTransfer.files);
        },
        [handleFileSelect]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDeleteAvatar = async () => {
        setIsDeleting(true);
        try {
            const response = await userService.deleteAvatar(t);
            await refreshUser();
            toast.success(response.message || t("settings.avatar.deleteSuccess"));
            setShowDeleteDialog(false);
        } catch (error) {
            const apiError = error as ApiError;
            toast.error(apiError.message || t("settings.avatar.deleteFailed"));
        } finally {
            setIsDeleting(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const clearPreview = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={className}>
            <Card className="shadow-none border-none">
                <CardContent className="p-0">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{t("settings.avatar.title")}</h3>

                        {/* Current Avatar Display */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
                                    {previewUrl ? (
                                        <Avatar className="w-20 h-20">
                                            <AvatarImage src={previewUrl} alt="Preview" />
                                            <AvatarFallback>{getAvatarFallback(user?.name)}</AvatarFallback>
                                        </Avatar>
                                    ) : user?.avatar ? (
                                        <Avatar className="w-20 h-20">
                                            <AvatarImage src={getAvatarUrl(user.avatar) || undefined} alt={user.name} />
                                            <AvatarFallback>{getAvatarFallback(user.name)}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <User className="w-8 h-8 text-muted-foreground" />
                                    )}
                                </div>
                                {previewUrl && (
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                                        onClick={clearPreview}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    {user?.avatar ? t("settings.avatar.current") : t("settings.avatar.noAvatar")}
                                </p>
                                <p className="text-xs text-muted-foreground">{t("settings.avatar.supportedFormats")}</p>
                            </div>
                        </div>

                        {/* Upload Area */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragOver
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                            } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            {isUploading ? (
                                <div className="space-y-2">
                                    <Upload className="w-8 h-8 mx-auto animate-pulse text-primary" />
                                    <p className="text-sm text-muted-foreground">{t("settings.avatar.uploading")}</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Camera className="w-8 h-8 mx-auto text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{t("settings.avatar.dropOrClick")}</p>
                                        <p className="text-xs text-muted-foreground">{t("settings.avatar.maxSize")}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={triggerFileInput}
                                        disabled={isUploading}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {t("settings.avatar.selectFile")}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        {user?.avatar && (
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowDeleteDialog(true)}
                                    disabled={isUploading || isDeleting}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {t("settings.avatar.delete")}
                                </Button>
                            </div>
                        )}

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("settings.avatar.confirmDeleteTitle")}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">{t("settings.avatar.confirmDeleteDescription")}</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                            {t("common.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAvatar} disabled={isDeleting}>
                            {isDeleting ? t("settings.avatar.deleting") : t("common.delete")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
