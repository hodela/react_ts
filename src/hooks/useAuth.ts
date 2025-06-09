"use client";
/**
 * @description Hook để xử lý việc đăng nhập và đăng xuất với refresh token mechanism
 * @returns {Object} Object chứa các state và hàm xử lý đăng nhập và đăng xuất
 */
import { authService } from "@/api/services/auth.service";
import { userService } from "@/api/services/user.service";
import type { ApiError, LoginRequest } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    // Get current user query - chỉ fetch khi user authenticated
    const {
        data: user,
        isLoading: isLoadingUser,
        error: userError,
    } = useQuery({
        queryKey: ["auth", "user"],
        queryFn: () => userService.getCurrentUser(t),
        enabled: authService.isAuthenticated(), // Chỉ fetch khi có token hợp lệ
        retry: (failureCount, error: any) => {
            // Không retry nếu là lỗi 401 (token issues)
            if (error?.response?.status === 401) {
                return false;
            }
            return failureCount < 2;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    });

    const [loginError, setLoginError] = useState<ApiError | null>(null);

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials, t),
        onSuccess: (data) => {
            // Tokens đã được lưu trong authService.login()

            // Cập nhật cache user
            queryClient.setQueryData(["auth", "user"], data.user);

            // Invalidate và refetch các queries liên quan
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
        onError: (error) => {
            console.error("Login failed:", error);
            setLoginError(error);
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            // Clear tất cả cache
            queryClient.clear();

            // Redirect về trang chủ
            window.location.href = "/";
        },
        onError: (error) => {
            console.error("Logout failed:", error);
            // Vẫn clear cache và redirect nếu logout API fail
            queryClient.clear();
            window.location.href = "/";
        },
    });

    // Listen for logout events từ axios interceptor
    useEffect(() => {
        const handleAuthLogout = () => {
            // Clear cache khi logout event được trigger
            queryClient.clear();

            // Không cần redirect ở đây vì axios interceptor đã handle
        };

        window.addEventListener("auth:logout", handleAuthLogout);

        return () => {
            window.removeEventListener("auth:logout", handleAuthLogout);
        };
    }, [queryClient]);

    // Kiểm tra authentication status
    const isAuthenticated = authService.isAuthenticated();

    // Force logout nếu không còn authenticated (refresh token hết hạn)
    useEffect(() => {
        if (!isAuthenticated && user) {
            // User data exists nhưng tokens không hợp lệ
            queryClient.setQueryData(["auth", "user"], null);
            queryClient.clear();
        }
    }, [isAuthenticated, user, queryClient]);

    return {
        // Data
        user,
        isAuthenticated,

        // Loading states
        isLoadingUser,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,

        // Error states
        userError,
        loginError,
        logoutError: logoutMutation.error,

        // Actions
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,

        // Reset functions
        resetLoginError: loginMutation.reset,
        resetLogoutError: logoutMutation.reset,

        // Token utilities
        getTokens: authService.getTokens,

        // Force refresh user data
        refreshUser: () => queryClient.invalidateQueries({ queryKey: ["auth", "user"] }),
    };
};
