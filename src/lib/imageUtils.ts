/**
 * Utility functions for handling image URLs
 */

/**
 * Get full avatar URL by combining with base URL
 * @param avatarPath - Avatar path from user data
 * @returns Full avatar URL or null if no avatar
 */
export const getAvatarUrl = (avatarPath?: string | null): string | null => {
    if (!avatarPath) return null;

    // If it's already a full URL (starts with http/https), return as is
    if (avatarPath.startsWith("http")) {
        return avatarPath;
    }

    // Remove leading slash from avatar path if exists
    const cleanPath = avatarPath.startsWith("/") ? avatarPath.slice(1) : avatarPath;

    // Combine base URL with avatar path
    return `/${cleanPath}`;
};

/**
 * Get avatar fallback text from user name
 * @param name - User name
 * @returns First character of name in uppercase or 'U' as fallback
 */
export const getAvatarFallback = (name?: string | null): string => {
    return name?.charAt(0)?.toUpperCase() || "U";
};
