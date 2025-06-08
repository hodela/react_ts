import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { tokenManager } from "@/lib/tokenManager";
import type { ApiError, RefreshTokenResponse } from "@/types/api";

/**
 * API Base URL - Lấy từ environment variables hoặc fallback to localhost
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Axios instance chính cho tất cả API calls
 * Được cấu hình với interceptors để xử lý authentication và error handling
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Queue interface cho các requests đang chờ refresh token
 */
interface PendingRequest {
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}

/**
 * State management cho refresh token process
 */
let isRefreshing = false;
let failedQueue: PendingRequest[] = [];

/**
 * Xử lý queue các requests đang chờ sau khi refresh token hoàn tất
 * @param error - Lỗi nếu refresh thất bại
 * @param token - Access token mới nếu refresh thành công
 */
const processQueue = (error: any, token?: string | null): void => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

/**
 * Request interceptor - Tự động thêm auth token và kiểm tra token expiry
 * Đảm bảo mọi request đều có valid access token
 */
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            // Skip token logic cho refresh endpoint để tránh infinite loop
            if (config.url?.includes("/auth/refresh")) {
                return config;
            }

            const accessToken = tokenManager.getAccessToken();

            if (accessToken) {
                // Kiểm tra xem token có sắp hết hạn không (< 5 phút)
                if (tokenManager.shouldRefreshToken() && !isRefreshing) {
                    try {
                        await refreshTokenIfNeeded();
                    } catch (error) {
                        console.error("Pre-emptive token refresh failed:", error);
                        handleLogout();
                        return Promise.reject(error);
                    }
                }

                // Thêm fresh token vào header
                config.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
            }

            return config;
        } catch (error) {
            console.error("Request interceptor error:", error);
            return Promise.reject(error);
        }
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Xử lý lỗi và auto refresh token khi gặp 401
 * Implement retry mechanism cho failed requests sau khi refresh token
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log successful responses in development
        if (import.meta.env.DEV) {
            console.log(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data,
            });
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Log errors in development
        if (import.meta.env.DEV) {
            console.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
                status: error.response?.status,
                message: error.message,
                data: error.response?.data,
            });
        }

        // Xử lý lỗi 401 - Unauthorized (Token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip retry cho refresh endpoint để tránh infinite loop
            if (originalRequest.url?.includes("/auth/refresh")) {
                console.warn("Refresh token expired, logging out user");
                handleLogout();
                return Promise.reject(formatApiError(error));
            }

            if (isRefreshing) {
                // Nếu đang refresh, thêm request vào queue để retry sau
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        originalRequest.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await refreshTokenIfNeeded();
                processQueue(null, tokenManager.getAccessToken());

                // Retry original request với token mới
                originalRequest.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                handleLogout();
                return Promise.reject(formatApiError(error));
            } finally {
                isRefreshing = false;
            }
        }

        // Xử lý lỗi 403 - Forbidden (Insufficient permissions)
        if (error.response?.status === 403) {
            console.error("Access denied - insufficient permissions");
            // Có thể dispatch event để show notification
            window.dispatchEvent(
                new CustomEvent("auth:forbidden", {
                    detail: { message: "Bạn không có quyền truy cập tài nguyên này" },
                })
            );
        }

        // Xử lý lỗi 404 - Not Found
        if (error.response?.status === 404) {
            console.error("Resource not found:", originalRequest.url);
        }

        // Xử lý lỗi server 5xx
        if (error.response?.status && error.response.status >= 500) {
            console.error("Server error:", error.response.data);
            // Có thể dispatch event để show notification
            window.dispatchEvent(
                new CustomEvent("api:server-error", {
                    detail: {
                        message: "Máy chủ đang gặp sự cố, vui lòng thử lại sau",
                        status: error.response.status,
                    },
                })
            );
        }

        return Promise.reject(formatApiError(error));
    }
);

/**
 * Format lỗi API theo ApiError interface để consistent với codebase
 * @param error - AxiosError từ request
 * @returns ApiError object
 */
const formatApiError = (error: AxiosError): ApiError => {
    const apiError = error.response?.data as any;

    return {
        message: apiError?.message || error.message || "Có lỗi xảy ra khi gọi API",
        code: apiError?.code || `HTTP_${error.response?.status || "UNKNOWN"}`,
        details: apiError?.details || {
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
        },
    };
};

/**
 * Refresh access token bằng refresh token
 * Sử dụng raw axios để tránh interceptor loop
 * @throws Error - Khi refresh token hết hạn hoặc không hợp lệ
 */
const refreshTokenIfNeeded = async (): Promise<void> => {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken || tokenManager.isRefreshTokenExpired()) {
        throw new Error("Refresh token expired or not available");
    }

    try {
        console.log("Refreshing access token...");

        // Sử dụng raw axios để tránh interceptors
        const response = await axios.post<RefreshTokenResponse>(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 5000, // Shorter timeout for refresh requests
            }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Cập nhật tokens dựa trên response từ server
        if (newRefreshToken) {
            // Server implementation với refresh token rotation
            tokenManager.setTokens(accessToken, newRefreshToken);
            console.log("Tokens refreshed successfully with rotation");
        } else {
            // Server chỉ trả về access token mới
            tokenManager.updateAccessToken(accessToken);
            console.log("Access token refreshed successfully");
        }
    } catch (error: any) {
        console.error("Token refresh failed:", error.response?.data || error.message);
        tokenManager.clearTokens();
        throw new Error("Failed to refresh token");
    }
};

/**
 * Xử lý logout user và cleanup
 * Clear tokens, dispatch events và redirect về login page
 */
const handleLogout = (): void => {
    console.log("Handling user logout...");

    // Clear tokens khỏi localStorage
    tokenManager.clearTokens();

    // Dispatch custom event để notify các components về logout
    window.dispatchEvent(
        new CustomEvent("auth:logout", {
            detail: {
                reason: "token_expired",
                message: "Phiên đăng nhập đã hết hạn",
            },
        })
    );

    // Redirect về trang login với current path để redirect back sau login
    const currentPath = window.location.pathname;
    if (currentPath !== "/login") {
        const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;

        // Sử dụng setTimeout để tránh race condition với state updates
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 100);
    }
};

/**
 * Utility function để check network connectivity
 * @returns boolean - True nếu có kết nối mạng
 */
export const isOnline = (): boolean => {
    return navigator.onLine;
};

/**
 * Utility function để retry request với exponential backoff
 * @param fn - Function để retry
 * @param maxRetries - Số lần retry tối đa
 * @param delay - Delay ban đầu (ms)
 */
export const retryRequest = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> => {
    let lastError: any;

    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (i === maxRetries) {
                break;
            }

            // Exponential backoff với jitter
            const backoffDelay = delay * Math.pow(2, i) + Math.random() * 1000;
            console.log(`Request failed, retrying in ${backoffDelay}ms... (${i + 1}/${maxRetries})`);

            await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        }
    }

    throw lastError;
};

export default apiClient;
