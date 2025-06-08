// Base API Response type
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

// Paginated response type
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

// Error response type
export interface ApiError {
    message: string;
    code?: string;
    details?: Record<string, any>;
}

// User types example
export interface IUser {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    language?: string;
    role?: string;
    theme?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    email: string;
    name: string;
    password: string;
}

export interface UpdateUserRequest {
    name?: string;
    avatar?: string;
    theme?: string;
    language?: string;
}

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
    expiresIn?: number; // Access token expiry in seconds (optional)
    tokenType?: string; // Usually "Bearer"
}

// Refresh token types
export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string; // Optional - some implementations only return new access token
    expiresIn?: number; // Access token expiry in seconds
}

// Register types
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    confirmPassword?: string;
}

export interface RegisterResponse {
    user: IUser;
    message?: string;
    requiresVerification?: boolean;
}

// Password reset types
export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

// Token status types
export interface TokenStatus {
    isValid: boolean;
    expiresAt?: string;
    timeRemaining?: number; // in milliseconds
}

// Profile update types
export interface UpdateProfileRequest {
    name?: string;
    avatar?: string;
    theme?: string;
    language?: string;
}

export interface UpdateProfileResponse {
    user: IUser;
    message?: string;
}

// Password change types
export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}
