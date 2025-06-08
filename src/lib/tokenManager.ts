interface TokenData {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number; // timestamp
    refreshTokenExpiry: number; // timestamp
}

class TokenManager {
    private readonly ACCESS_TOKEN_KEY = "access_token";
    private readonly REFRESH_TOKEN_KEY = "refresh_token";
    private readonly ACCESS_TOKEN_EXPIRY_KEY = "access_token_expiry";
    private readonly REFRESH_TOKEN_EXPIRY_KEY = "refresh_token_expiry";

    // 4 hours for access token
    private readonly ACCESS_TOKEN_DURATION = 4 * 60 * 60 * 1000; // 4h in ms
    // 30 days for refresh token
    private readonly REFRESH_TOKEN_DURATION = 30 * 24 * 60 * 60 * 1000; // 30d in ms
    // Refresh threshold - refresh token when < 5 minutes left
    private readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in ms

    /**
     * Lưu tokens sau khi login thành công
     */
    setTokens(accessToken: string, refreshToken: string): void {
        const now = Date.now();
        const accessTokenExpiry = now + this.ACCESS_TOKEN_DURATION;
        const refreshTokenExpiry = now + this.REFRESH_TOKEN_DURATION;

        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(this.ACCESS_TOKEN_EXPIRY_KEY, accessTokenExpiry.toString());
        localStorage.setItem(this.REFRESH_TOKEN_EXPIRY_KEY, refreshTokenExpiry.toString());
    }

    /**
     * Lấy access token hiện tại
     */
    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    /**
     * Lấy refresh token hiện tại
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Kiểm tra xem access token có hết hạn không
     */
    isAccessTokenExpired(): boolean {
        const expiry = localStorage.getItem(this.ACCESS_TOKEN_EXPIRY_KEY);
        if (!expiry) return true;

        return Date.now() >= parseInt(expiry);
    }

    /**
     * Kiểm tra xem refresh token có hết hạn không
     */
    isRefreshTokenExpired(): boolean {
        const expiry = localStorage.getItem(this.REFRESH_TOKEN_EXPIRY_KEY);
        if (!expiry) return true;

        return Date.now() >= parseInt(expiry);
    }

    /**
     * Kiểm tra xem access token có sắp hết hạn không (< 5 phút)
     */
    shouldRefreshToken(): boolean {
        const expiry = localStorage.getItem(this.ACCESS_TOKEN_EXPIRY_KEY);
        if (!expiry) return true;

        const timeLeft = parseInt(expiry) - Date.now();
        return timeLeft <= this.REFRESH_THRESHOLD;
    }

    /**
     * Cập nhật access token mới sau khi refresh
     */
    updateAccessToken(accessToken: string): void {
        const now = Date.now();
        const accessTokenExpiry = now + this.ACCESS_TOKEN_DURATION;

        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.ACCESS_TOKEN_EXPIRY_KEY, accessTokenExpiry.toString());
    }

    /**
     * Xóa tất cả tokens (logout)
     */
    clearTokens(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.ACCESS_TOKEN_EXPIRY_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_EXPIRY_KEY);
    }

    /**
     * Kiểm tra xem user có đăng nhập không
     */
    isAuthenticated(): boolean {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();

        if (!accessToken || !refreshToken) return false;

        // Nếu refresh token hết hạn thì user không còn authenticated
        if (this.isRefreshTokenExpired()) {
            this.clearTokens();
            return false;
        }

        return true;
    }

    /**
     * Lấy tất cả token data
     */
    getTokenData(): TokenData | null {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();
        const accessTokenExpiry = localStorage.getItem(this.ACCESS_TOKEN_EXPIRY_KEY);
        const refreshTokenExpiry = localStorage.getItem(this.REFRESH_TOKEN_EXPIRY_KEY);

        if (!accessToken || !refreshToken || !accessTokenExpiry || !refreshTokenExpiry) {
            return null;
        }

        return {
            accessToken,
            refreshToken,
            accessTokenExpiry: parseInt(accessTokenExpiry),
            refreshTokenExpiry: parseInt(refreshTokenExpiry),
        };
    }
}

export const tokenManager = new TokenManager();
