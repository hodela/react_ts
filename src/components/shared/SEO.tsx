import type { FC } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { SEOData } from "@/types/seo";

interface SEOProps extends SEOData {
    children?: React.ReactNode;
}

export const SEO: FC<SEOProps> = ({
    title = "React App",
    description = "Ứng dụng React hiện đại với TypeScript và Vite",
    keywords = "react, typescript, vite, web app",
    image = "/og-image.jpg",
    url = typeof window !== "undefined" ? window.location.href : "",
    type = "website",
    siteName = "React App",
    locale,
    twitterCard = "summary_large_image",
    twitterSite,
    twitterCreator,
    canonical = typeof window !== "undefined" ? window.location.href : "",
    robots = "index, follow",
    author,
    publishedTime,
    modifiedTime,
    schema,
    children,
}) => {
    const location = useLocation();
    const { i18n } = useTranslation();

    // Get current language and set default locale
    const currentLanguage = i18n.language || "en";
    const currentLocale = locale || (currentLanguage === "vi" ? "vi_VN" : "en_US");

    // Generate alternate URLs for different languages
    const generateAlternateUrls = () => {
        const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";
        const currentPath = location.pathname;

        return {
            en: `${baseUrl}${currentPath}`,
            vi: `${baseUrl}${currentPath}`,
        };
    };

    const alternateUrls = generateAlternateUrls();

    // Force update SEO when component mounts or location changes
    useEffect(() => {
        // Update document title immediately for better UX
        if (typeof document !== "undefined" && title) {
            document.title = title;
        }

        // Small delay to ensure DOM is ready and Helmet has processed
        const timer = setTimeout(() => {
            if (typeof window !== "undefined") {
                // Force Helmet to re-process by triggering a custom event
                window.dispatchEvent(
                    new CustomEvent("helmet-update", {
                        detail: { title, description, url: window.location.href },
                    })
                );
            }
        }, 50); // Increased delay for better reliability

        return () => clearTimeout(timer);
    }, [title, description, keywords, url, canonical, location.pathname, currentLanguage]);

    return (
        <Helmet>
            {/* Tiêu đề */}
            <title>{title}</title>

            {/* Meta tags cơ bản */}
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content={robots} />
            {author && <meta name="author" content={author} />}

            {/* Language and Locale */}
            <html lang={currentLanguage} />
            <meta httpEquiv="content-language" content={currentLanguage} />

            {/* Canonical URL và Alternate URLs cho đa ngôn ngữ */}
            <link rel="canonical" href={canonical} />

            {/* Hreflang cho SEO đa ngôn ngữ */}
            <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
            <link rel="alternate" hrefLang="vi" href={alternateUrls.vi} />
            <link rel="alternate" hrefLang="x-default" href={alternateUrls.en} />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={currentLocale} />
            {/* Alternate locales for Open Graph */}
            {currentLanguage === "en" && <meta property="og:locale:alternate" content="vi_VN" />}
            {currentLanguage === "vi" && <meta property="og:locale:alternate" content="en_US" />}
            {image && <meta property="og:image" content={image} />}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
            {twitterSite && <meta name="twitter:site" content={twitterSite} />}
            {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

            {/* Structured Data */}
            {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}

            {children}
        </Helmet>
    );
};
