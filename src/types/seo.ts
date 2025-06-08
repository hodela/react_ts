export interface SEOData {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    locale?: string;
    twitterCard?: "summary" | "summary_large_image" | "app" | "player";
    twitterSite?: string;
    twitterCreator?: string;
    canonical?: string;
    robots?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    schema?: any;
}
