export const SEO_CONSTANTS = {
    SITE_NAME: "React App",
    SITE_URL: "https://your-domain.com",
    SITE_DESCRIPTION: "Ứng dụng React hiện đại với TypeScript và Vite",
    SITE_KEYWORDS: "react, typescript, vite, web app, modern web development",
    SITE_AUTHOR: "Your Name",
    SITE_LOCALE: "vi_VN",
    TWITTER_HANDLE: "@your_twitter",
    LOGO_URL: "/logo.png",
    DEFAULT_IMAGE: "/og-image.jpg",
    FAVICON: "/favicon.ico",
} as const;

export const SCHEMA_TYPES = {
    WEBSITE: "WebSite",
    ARTICLE: "Article",
    BLOG_POSTING: "BlogPosting",
    PERSON: "Person",
    ORGANIZATION: "Organization",
    PRODUCT: "Product",
    SERVICE: "Service",
    LOCAL_BUSINESS: "LocalBusiness",
} as const;

export const TWITTER_CARD_TYPES = {
    SUMMARY: "summary",
    SUMMARY_LARGE_IMAGE: "summary_large_image",
    APP: "app",
    PLAYER: "player",
} as const;

export const ROBOTS_INSTRUCTIONS = {
    INDEX_FOLLOW: "index, follow",
    NOINDEX_NOFOLLOW: "noindex, nofollow",
    INDEX_NOFOLLOW: "index, nofollow",
    NOINDEX_FOLLOW: "noindex, follow",
} as const;
