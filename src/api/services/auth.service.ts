import { apiClient } from "../client";
import { tokenManager } from "@/lib/tokenManager";
import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    IUser,
    RegisterRequest,
    RegisterResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ApiError,
} from "@/types/api";

/**
 * Authentication service for handling login, logout, token refresh, and user management
 * Follows API specification defined in SETUP-GUIDE.md
 */
export const authService = {
    /**
     * Đăng nhập user với email và password
     * @param credentials - Thông tin đăng nhập (email, password)
     * @returns Promise<LoginResponse> - User data và tokens
     * @throws ApiError - Khi thông tin đăng nhập không hợp lệ
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>("/auth/login", credentials);

            // Lưu tokens sau khi login thành công
            const { accessToken, refreshToken } = response.data;
            tokenManager.setTokens(accessToken, refreshToken);

            return response.data;
        } catch (error: any) {
            // Re-throw với proper error format
            throw {
                message: error.response?.data?.message || "Đăng nhập thất bại",
                code: error.response?.data?.code || "LOGIN_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Lấy thông tin user hiện tại
     * @returns Promise<IUser> - Thông tin user
     * @throws ApiError - Khi không có quyền truy cập hoặc token không hợp lệ
     */
    getCurrentUser: async (): Promise<IUser> => {
        try {
            const response = await apiClient.get<IUser>("/auth/me");
            return response.data;
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Không thể lấy thông tin user",
                code: error.response?.data?.code || "GET_USER_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Đăng xuất user và invalidate tokens
     * @returns Promise<void>
     */
    logout: async (): Promise<void> => {
        try {
            const refreshToken = tokenManager.getRefreshToken();

            if (refreshToken) {
                // Gọi logout API để invalidate refresh token trên server
                await apiClient.post("/auth/logout", {
                    refreshToken,
                });
            }
        } catch (error) {
            // Log warning nhưng vẫn tiếp tục clear tokens local
            console.warn("Logout API failed, but clearing local tokens:", error);
        } finally {
            // Luôn clear tokens khỏi localStorage
            tokenManager.clearTokens();
        }
    },

    /**
     * Làm mới access token bằng refresh token
     * @param refreshToken - Refresh token để làm mới access token
     * @returns Promise<RefreshTokenResponse> - Token mới
     * @throws ApiError - Khi refresh token không hợp lệ hoặc hết hạn
     */
    refreshToken: async (refreshToken: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
        try {
            const response = await apiClient.post<RefreshTokenResponse>("/auth/refresh", {
                refreshToken: refreshToken.refreshToken,
            });

            // Cập nhật access token mới
            if (response.data.accessToken) {
                tokenManager.updateAccessToken(response.data.accessToken);

                // Nếu server trả về refresh token mới, cập nhật cả refresh token
                if (response.data.refreshToken) {
                    tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
                }
            }

            return response.data;
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Không thể làm mới token",
                code: error.response?.data?.code || "REFRESH_TOKEN_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Đăng ký user mới
     * @param userData - Thông tin đăng ký
     * @returns Promise<RegisterResponse> - Thông tin user mới
     * @throws ApiError - Khi dữ liệu không hợp lệ hoặc email đã tồn tại
     */
    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const response = await apiClient.post<RegisterResponse>("/auth/register", userData);
            return response.data;
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Đăng ký thất bại",
                code: error.response?.data?.code || "REGISTER_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Gửi email khôi phục mật khẩu
     * @param email - Email để gửi link khôi phục
     * @returns Promise<void>
     * @throws ApiError - Khi email không tồn tại
     */
    forgotPassword: async (email: string): Promise<void> => {
        try {
            await apiClient.post("/auth/forgot-password", { email } as ForgotPasswordRequest);
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Gửi email khôi phục thất bại",
                code: error.response?.data?.code || "FORGOT_PASSWORD_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Đặt lại mật khẩu với token từ email
     * @param resetData - Token và mật khẩu mới
     * @returns Promise<void>
     * @throws ApiError - Khi token không hợp lệ hoặc hết hạn
     */
    resetPassword: async (resetData: ResetPasswordRequest): Promise<void> => {
        try {
            await apiClient.post("/auth/reset-password", resetData);
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Đặt lại mật khẩu thất bại",
                code: error.response?.data?.code || "RESET_PASSWORD_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Xác thực email với token
     * @param token - Token xác thực từ email
     * @returns Promise<void>
     * @throws ApiError - Khi token không hợp lệ
     */
    verifyEmail: async (token: string): Promise<void> => {
        try {
            await apiClient.post("/auth/verify-email", { token });
        } catch (error: any) {
            throw {
                message: error.response?.data?.message || "Xác thực email thất bại",
                code: error.response?.data?.code || "VERIFY_EMAIL_FAILED",
                details: error.response?.data?.details,
            } as ApiError;
        }
    },

    /**
     * Kiểm tra trạng thái authentication
     * @returns boolean - True nếu user đã đăng nhập
     */
    isAuthenticated: (): boolean => {
        return tokenManager.isAuthenticated();
    },

    /**
     * Lấy tokens hiện tại
     * @returns Object chứa access và refresh tokens
     */
    getTokens: () => {
        return {
            accessToken: tokenManager.getAccessToken(),
            refreshToken: tokenManager.getRefreshToken(),
        };
    },

    /**
     * Kiểm tra xem access token có cần refresh không
     * @returns boolean - True nếu cần refresh token
     */
    shouldRefreshToken: (): boolean => {
        return tokenManager.shouldRefreshToken();
    },

    /**
     * Kiểm tra xem access token có hết hạn không
     * @returns boolean - True nếu token đã hết hạn
     */
    isAccessTokenExpired: (): boolean => {
        return tokenManager.isAccessTokenExpired();
    },
};
