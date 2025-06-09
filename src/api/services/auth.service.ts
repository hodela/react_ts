import { tokenManager } from "@/lib/tokenManager";
import type {
    ApiError,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    ResendVerificationRequest,
} from "@/types/api";
import { apiClient } from "../client";
import type { TFunction } from "i18next";

/**
 * Authentication service for handling login, logout, token refresh, and user management
 * Follows API specification defined in SETUP-GUIDE.md
 */
export const authService = {
    /**
     * Đăng nhập user với email và password
     * @param credentials - Thông tin đăng nhập (email, password)
     * @param t - Hàm dịch
     * @returns Promise<LoginResponse> - User data và tokens
     * @throws ApiError - Khi thông tin đăng nhập không hợp lệ
     */
    login: async (credentials: LoginRequest, t: TFunction): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>("/auth/login", credentials);

            if (import.meta.env.VITE_REQUIRE_EMAIL_VERIFICATION === "true" && !response.data.user.isVerified) {
                throw {
                    message: t("auth.login.errors.emailNotVerified"),
                    code: "EMAIL_NOT_VERIFIED",
                } as ApiError;
            }

            // Lưu tokens sau khi login thành công
            const { accessToken, refreshToken } = response.data;
            tokenManager.setTokens(accessToken, refreshToken);

            return response.data;
        } catch (error: any) {
            // Re-throw với proper error format
            throw {
                message: error?.message || t("auth.login.errors.loginFailed"),
                code: error?.code || "LOGIN_FAILED",
                details: error?.details,
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
                message: error?.message || "Không thể làm mới token",
                code: error?.code || "REFRESH_TOKEN_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },

    /**
     * Đăng ký user mới
     * @param userData - Thông tin đăng ký
     * @param t - Hàm dịch
     * @returns Promise<RegisterResponse> - Thông tin user mới
     * @throws ApiError - Khi dữ liệu không hợp lệ hoặc email đã tồn tại
     */
    register: async (userData: RegisterRequest, t: TFunction): Promise<RegisterResponse> => {
        try {
            const response = await apiClient.post<RegisterResponse>("/auth/register", userData);
            return response.data;
        } catch (error: any) {
            throw {
                message: error?.message || t("auth.register.errors.registerFailed"),
                code: error?.code || "REGISTER_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },

    /**
     * Gửi email khôi phục mật khẩu
     * @param email - Email để gửi link khôi phục
     * @param t - Hàm dịch
     * @returns Promise<void>
     * @throws ApiError - Khi email không tồn tại
     */
    forgotPassword: async (email: string, t: TFunction): Promise<void> => {
        try {
            await apiClient.post("/auth/forgot-password", { email } as ForgotPasswordRequest);
        } catch (error: any) {
            throw {
                message: error?.message || t("auth.forgotPassword.errors.sendFailed"),
                code: error?.code || "FORGOT_PASSWORD_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },

    /**
     * Đặt lại mật khẩu với token từ email
     * @param resetData - Token và mật khẩu mới
     * @param t - Hàm dịch
     * @returns Promise<void>
     * @throws ApiError - Khi token không hợp lệ hoặc hết hạn
     */
    resetPassword: async (resetData: ResetPasswordRequest, t: TFunction): Promise<void> => {
        try {
            await apiClient.post("/auth/reset-password", resetData);
        } catch (error: any) {
            throw {
                message: error?.message || t("auth.resetPassword.errors.resetPasswordFailed"),
                code: error?.code || "RESET_PASSWORD_FAILED",
                details: error?.details,
            } as ApiError;
        }
    },

    /**
     * Xác thực email với token
     * @param token - Token xác thực từ email
     * @param t - Hàm dịch
     * @returns Promise<void>
     * @throws ApiError - Khi token không hợp lệ
     */
    verifyEmail: async (token: string, t: TFunction): Promise<void> => {
        try {
            await apiClient.post("/auth/verify-email", { token });
        } catch (error: any) {
            const status = error?.response?.status;
            const errorCode = error?.response?.data?.code || error?.code;

            // Xử lý các mã lỗi cụ thể
            let code = "VERIFY_EMAIL_FAILED";
            let message = t("auth.verifyEmail.errors.verifyEmailFailed");

            if (status === 410 || errorCode === "TOKEN_EXPIRED") {
                code = "TOKEN_EXPIRED";
                message = t("auth.verifyEmail.errors.tokenExpired");
            } else if (status === 400 || errorCode === "INVALID_TOKEN") {
                code = "INVALID_TOKEN";
                message = t("auth.verifyEmail.errors.invalidToken");
            } else if (errorCode === "EMAIL_ALREADY_VERIFIED") {
                code = "EMAIL_ALREADY_VERIFIED";
                message = t("auth.verifyEmail.errors.emailAlreadyVerified");
            }

            throw {
                message: error?.response?.data?.message || message,
                code,
                details: error?.response?.data?.details || error?.details,
            } as ApiError;
        }
    },

    /**
     * Gửi lại email xác thực
     * @param email - Email để gửi lại liên kết xác thực
     * @param t - Hàm dịch
     * @returns Promise<void>
     * @throws ApiError - Khi email không tồn tại hoặc đã được xác thực
     */
    resendVerification: async (email: string, t: TFunction): Promise<void> => {
        try {
            await apiClient.post("/auth/resend-verification", { email } as ResendVerificationRequest);
        } catch (error: any) {
            const status = error?.response?.status;
            const errorCode = error?.response?.data?.code || error?.code;

            // Xử lý các mã lỗi cụ thể
            let code = "RESEND_VERIFICATION_FAILED";
            let message = t("auth.resendVerification.errors.sendFailed");

            if (status === 404 || errorCode === "EMAIL_NOT_FOUND") {
                code = "EMAIL_NOT_FOUND";
                message = t("auth.resendVerification.errors.emailNotFound");
            } else if (status === 400 || errorCode === "EMAIL_ALREADY_VERIFIED") {
                code = "EMAIL_ALREADY_VERIFIED";
                message = t("auth.resendVerification.errors.emailAlreadyVerified");
            } else if (status === 429 || errorCode === "TOO_MANY_REQUESTS") {
                code = "TOO_MANY_REQUESTS";
                message = t("auth.resendVerification.errors.tooManyRequests");
            }

            throw {
                message: error?.response?.data?.message || message,
                code,
                details: error?.response?.data?.details || error?.details,
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
