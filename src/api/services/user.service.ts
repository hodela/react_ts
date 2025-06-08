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
     * Cập nhật thông tin profile của user hiện tại
     * @param profileData - Dữ liệu profile cần cập nhật (name, avatar, theme, language)
     * @returns Promise<UpdateProfileResponse> - Thông tin user đã được cập nhật
     * @throws ApiError - Khi dữ liệu không hợp lệ hoặc không có quyền truy cập
     */
    updateProfile: async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
        try {
            const response = await apiClient.put<UpdateProfileResponse>("/users/profile", profileData);
            return response.data;
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Cập nhật profile thất bại",
                code: error.response?.data?.code || "UPDATE_PROFILE_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Thay đổi mật khẩu của user hiện tại
     * @param passwordData - Dữ liệu thay đổi mật khẩu (old password, new password, confirm)
     * @returns Promise<ChangePasswordResponse> - Thông báo thành công
     * @throws ApiError - Khi mật khẩu cũ không đúng hoặc mật khẩu mới không hợp lệ
     */
    changePassword: async (passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
        try {
            const response = await apiClient.put<ChangePasswordResponse>("/users/change-password", passwordData);
            return response.data;
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Thay đổi mật khẩu thất bại",
                code: error.response?.data?.code || "CHANGE_PASSWORD_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Lấy thông tin profile của user hiện tại
     * @returns Promise<IUser> - Thông tin user
     * @throws ApiError - Khi không có quyền truy cập hoặc token không hợp lệ
     */
    getProfile: async (): Promise<IUser> => {
        try {
            const response = await apiClient.get<IUser>("/users/profile");
            return response.data;
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Không thể lấy thông tin profile",
                code: error.response?.data?.code || "GET_PROFILE_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Upload avatar cho user hiện tại
     * @param file - File ảnh avatar
     * @returns Promise<string> - URL của avatar đã upload
     * @throws ApiError - Khi file không hợp lệ hoặc upload thất bại
     */
    uploadAvatar: async (file: File): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await apiClient.post<{ avatarUrl: string }>("/users/upload-avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data.avatarUrl;
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Upload avatar thất bại",
                code: error.response?.data?.code || "UPLOAD_AVATAR_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Xóa avatar của user hiện tại
     * @returns Promise<void>
     * @throws ApiError - Khi không có quyền truy cập
     */
    deleteAvatar: async (): Promise<void> => {
        try {
            await apiClient.delete("/users/avatar");
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Xóa avatar thất bại",
                code: error.response?.data?.code || "DELETE_AVATAR_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Cập nhật theme preference của user
     * @param theme - Theme preference ('light' | 'dark' | 'system')
     * @returns Promise<IUser> - User data với theme đã cập nhật
     * @throws ApiError - Khi theme không hợp lệ
     */
    updateTheme: async (theme: "light" | "dark" | "system"): Promise<IUser> => {
        try {
            const response = await apiClient.patch<IUser>("/users/theme", { theme });
            return response.data;
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Cập nhật theme thất bại",
                code: error.response?.data?.code || "UPDATE_THEME_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Cập nhật language preference của user
     * @param language - Language code ('vi' | 'en')
     * @returns Promise<IUser> - User data với language đã cập nhật
     * @throws ApiError - Khi language không hợp lệ
     */
    updateLanguage: async (language: "vi" | "en"): Promise<IUser> => {
        try {
            const response = await apiClient.patch<IUser>("/users/language", { language });
            return response.data;
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Cập nhật ngôn ngữ thất bại",
                code: error.response?.data?.code || "UPDATE_LANGUAGE_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },
};
