import { SEO_CONSTANTS, SCHEMA_TYPES } from "@/constants/seo";
import type { TFunction } from "i18next";

export interface WebsiteSchema {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    description: string;
    potentialAction?: {
        "@type": string;
        target: string;
        "query-input": string;
    };
}

export interface ArticleSchema {
    "@context": string;
    "@type": string;
    headline: string;
    description: string;
    image: string[];
    author: {
        "@type": string;
        name: string;
    };
    publisher: {
        "@type": string;
        name: string;
        logo: {
            "@type": string;
            url: string;
        };
    };
    datePublished: string;
    dateModified?: string;
    mainEntityOfPage: {
        "@type": string;
        "@id": string;
    };
}

export interface OrganizationSchema {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    logo: string;
    description: string;
    contactPoint?: {
        "@type": string;
        telephone: string;
        contactType: string;
    };
    sameAs?: string[];
}

// Generate Website Schema with i18n support
export const generateWebsiteSchema = (
    t?: TFunction,
    name?: string,
    url: string = SEO_CONSTANTS.SITE_URL,
    description?: string
): WebsiteSchema => {
    const siteName = name || (t ? t("seo.defaultTitle") : SEO_CONSTANTS.SITE_NAME);
    const siteDescription = description || (t ? t("home.seo.description") : SEO_CONSTANTS.SITE_DESCRIPTION);

    return {
        "@context": "https://schema.org",
        "@type": SCHEMA_TYPES.WEBSITE,
        name: siteName,
        url,
        description: siteDescription,
        potentialAction: {
            "@type": "SearchAction",
            target: `${url}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
};

// Generate Article Schema
export const generateArticleSchema = ({
    title,
    description,
    image,
    author = SEO_CONSTANTS.SITE_AUTHOR,
    publishedTime,
    modifiedTime,
    url,
    t,
}: {
    title: string;
    description: string;
    image: string;
    author?: string;
    publishedTime: string;
    modifiedTime?: string;
    url: string;
    t?: TFunction;
}): ArticleSchema => {
    const siteName = t ? t("seo.defaultTitle") : SEO_CONSTANTS.SITE_NAME;

    return {
        "@context": "https://schema.org",
        "@type": SCHEMA_TYPES.ARTICLE,
        headline: title,
        description,
        image: [image],
        author: {
            "@type": SCHEMA_TYPES.PERSON,
            name: author,
        },
        publisher: {
            "@type": SCHEMA_TYPES.ORGANIZATION,
            name: siteName,
            logo: {
                "@type": "ImageObject",
                url: SEO_CONSTANTS.LOGO_URL,
            },
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
    };
};

// Generate Organization Schema
export const generateOrganizationSchema = ({
    name,
    url = SEO_CONSTANTS.SITE_URL,
    logo = SEO_CONSTANTS.LOGO_URL,
    description,
    telephone,
    sameAs,
    t,
}: {
    name?: string;
    url?: string;
    logo?: string;
    description?: string;
    telephone?: string;
    sameAs?: string[];
    t?: TFunction;
}): OrganizationSchema => {
    const siteName = name || (t ? t("seo.defaultTitle") : SEO_CONSTANTS.SITE_NAME);
    const siteDescription = description || (t ? t("home.seo.description") : SEO_CONSTANTS.SITE_DESCRIPTION);

    const schema: OrganizationSchema = {
        "@context": "https://schema.org",
        "@type": SCHEMA_TYPES.ORGANIZATION,
        name: siteName,
        url,
        logo,
        description: siteDescription,
    };

    if (telephone) {
        schema.contactPoint = {
            "@type": "ContactPoint",
            telephone,
            contactType: "customer service",
        };
    }

    if (sameAs) {
        schema.sameAs = sameAs;
    }

    return schema;
};

// Generate page title with site name and i18n support
export const generatePageTitle = (pageTitle?: string, t?: TFunction, siteName?: string): string => {
    const defaultSiteName = siteName || (t ? t("seo.defaultTitle") : SEO_CONSTANTS.SITE_NAME);
    const separator = t ? t("seo.titleSeparator") : " | ";

    if (!pageTitle) return defaultSiteName;
    return `${pageTitle}${separator}${defaultSiteName}`;
};

// Generate meta description with length limit
export const generateMetaDescription = (description: string, maxLength: number = 160): string => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength - 3) + "...";
};

// Generate keywords array to string
export const generateKeywords = (keywords: string[]): string => {
    return keywords.join(", ");
};

// Generate canonical URL
export const generateCanonicalUrl = (path: string, baseUrl: string = SEO_CONSTANTS.SITE_URL): string => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}${cleanPath}`;
};

// Generate Open Graph image URL
export const generateOGImageUrl = (imagePath?: string, baseUrl: string = SEO_CONSTANTS.SITE_URL): string => {
    if (!imagePath) return `${baseUrl}${SEO_CONSTANTS.DEFAULT_IMAGE}`;

    if (imagePath.startsWith("http")) return imagePath;

    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}${cleanPath}`;
};

// Generate SEO data for auth pages
export const generateAuthPageSEO = (
    pageKey: string,
    t: TFunction,
    customTitle?: string,
    customDescription?: string,
    customKeywords?: string
) => {
    const title = customTitle || t(`auth.${pageKey}.seo.title`);
    const description = customDescription || t(`auth.${pageKey}.seo.description`);
    const keywords = customKeywords || t(`auth.${pageKey}.seo.keywords`);

    return {
        title: generatePageTitle(title, t),
        description: generateMetaDescription(description),
        keywords,
        schema: generateWebsiteSchema(t),
    };
};
