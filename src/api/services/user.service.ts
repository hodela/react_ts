import type { TFunction } from "i18next";
import { apiClient } from "../client";
import type {
    IUser,
    UpdateProfileRequest,
    UpdateProfileResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
    ApiError,
} from "@/types/api";

/**
 * User service for handling user profile management and user-related operations
 * Follows API specification defined in SETUP-GUIDE.md
 */
export const userService = {
    /**
     * Lấy thông tin user hiện tại
     * @returns Promise<IUser> - Thông tin user
     * @throws ApiError - Khi không có quyền truy cập hoặc token không hợp lệ
     */
    getCurrentUser: async (t: TFunction): Promise<IUser> => {
        try {
            const response = await apiClient.get<IUser>("/users/me");
            return response.data;
        } catch (error: any) {
            throw {
                message: error?.message || t("settings.getFailed"),
                code: error?.code || "GET_USER_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },
    /**
     * Cập nhật thông tin profile của user hiện tại
     * @param profileData - Dữ liệu profile cần cập nhật (name, avatar, theme, language)
     * @param t - Hàm dịch
     * @returns Promise<UpdateProfileResponse> - Thông tin user đã được cập nhật
     * @throws ApiError - Khi dữ liệu không hợp lệ hoặc không có quyền truy cập
     */
    updateProfile: async (profileData: UpdateProfileRequest, t: TFunction): Promise<UpdateProfileResponse> => {
        try {
            const response = await apiClient.put<UpdateProfileResponse>("/users/me", profileData);
            return response.data;
        } catch (error: any) {
            throw {
                message: error?.message || t("settings.updateFailed"),
                code: error?.code || "UPDATE_PROFILE_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },

    /**
     * Thay đổi mật khẩu của user hiện tại
     * @param passwordData - Dữ liệu thay đổi mật khẩu (old password, new password, confirm)
     * @param t - Hàm dịch
     * @returns Promise<ChangePasswordResponse> - Thông báo thành công
     * @throws ApiError - Khi mật khẩu cũ không đúng hoặc mật khẩu mới không hợp lệ
     */
    changePassword: async (passwordData: ChangePasswordRequest, t: TFunction): Promise<ChangePasswordResponse> => {
        try {
            const response = await apiClient.put<ChangePasswordResponse>("/users/change-password", passwordData);
            return response.data;
        } catch (error: any) {
            throw {
                message: error?.message || t("changePassword.failed"),
                code: error?.code || "CHANGE_PASSWORD_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },
    /**
     * Upload avatar cho user hiện tại
     * @param file - File ảnh avatar
     * @param t - Hàm dịch
     * @returns Promise<{ user: IUser; avatar: { url: string; filename: string; size: number } }> - User và thông tin avatar đã upload
     * @throws ApiError - Khi file không hợp lệ hoặc upload thất bại
     */
    uploadAvatar: async (
        file: File,
        t: TFunction
    ): Promise<{ user: IUser; avatar: { url: string; filename: string; size: number }; message: string }> => {
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await apiClient.post<{
                user: IUser;
                avatar: { url: string; filename: string; size: number };
                message: string;
            }>("/users/upload-avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error: any) {
            throw {
                message: error?.message || t("settings.uploadAvatarFailed"),
                code: error?.code || "UPLOAD_AVATAR_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },

    /**
     * Xóa avatar của user hiện tại
     * @param t - Hàm dịch
     * @returns Promise<{ user: IUser; message: string }> - User đã được cập nhật
     * @throws ApiError - Khi không có quyền truy cập
     */
    deleteAvatar: async (t: TFunction): Promise<{ user: IUser; message: string }> => {
        try {
            const response = await apiClient.delete<{ user: IUser; message: string }>("/users/avatar");
            return response.data;
        } catch (error: any) {
            throw {
                message: error?.message || t("settings.deleteAvatarFailed"),
                code: error?.code || "DELETE_AVATAR_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },

    /**
     * Cập nhật theme preference của user
     * @param theme - Theme preference ('light' | 'dark' | 'system')
     * @param t - Hàm dịch
     * @returns Promise<IUser> - User data với theme đã cập nhật
     * @throws ApiError - Khi theme không hợp lệ
     */
    updateTheme: async (theme: "light" | "dark" | "system", t: TFunction): Promise<IUser> => {
        try {
            const response = await apiClient.patch<IUser>("/users/theme", { theme });
            return response.data;
        } catch (error: any) {
            throw {
                message: error?.message || t("settings.updateFailed"),
                code: error?.code || "UPDATE_THEME_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },

    /**
     * Cập nhật language preference của user
     * @param language - Language code ('vi' | 'en')
     * @param t - Hàm dịch
     * @returns Promise<IUser> - User data với language đã cập nhật
     * @throws ApiError - Khi language không hợp lệ
     */
    updateLanguage: async (language: "vi" | "en", t: TFunction): Promise<IUser> => {
        try {
            const response = await apiClient.patch<IUser>("/users/language", { language });
            return response.data;
        } catch (error: any) {
            throw {
                message: error?.message || t("settings.updateFailed"),
                code: error?.code || "UPDATE_LANGUAGE_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },
    /**
     * Xóa tài khoản của user hiện tại
     * @param password - Mật khẩu của user
     * @param t - Hàm dịch
     * @returns Promise<void>
     * @throws ApiError - Khi không có quyền truy cập
     */
    deleteAccount: async (password: string, t: TFunction): Promise<void> => {
        try {
            await apiClient.delete("/users/delete-account", {
                data: { password },
            });
        } catch (error: any) {
            throw {
                message: error?.message || t("settings.deleteFailed"),
                code: error?.code || "DELETE_ACCOUNT_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },
};
