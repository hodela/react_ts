#!/usr/bin/env node

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SEO Constants (matching src/constants/seo.ts)
const SEO_CONSTANTS = {
    SITE_URL: "https://your-domain.com",
};

// Routes configuration
const routes = [
    {
        loc: "/",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "daily",
        priority: 1.0,
    },
    {
        loc: "/auth-demo",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: 0.8,
    },
    {
        loc: "/auth/login",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.6,
    },
    {
        loc: "/auth/register",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.6,
    },
    {
        loc: "/auth/forgot-password",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.4,
    },
    {
        loc: "/auth/reset-password",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.4,
    },
    {
        loc: "/auth/verify-email",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.4,
    },
    {
        loc: "/auth/verify-email-success",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.3,
    },
    {
        loc: "/auth/verify-email-failed",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.3,
    },
    {
        loc: "/auth/verify-email-expired",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.3,
    },

    // TODO: Add more paths here
];

// Generate sitemap XML
const generateSitemap = (baseUrl, routes) => {
    const urlset = routes
        .map((route) => {
            const fullUrl = route.loc.startsWith("http")
                ? route.loc
                : `${baseUrl}${route.loc.startsWith("/") ? route.loc : `/${route.loc}`}`;

            return `
    <url>
        <loc>${fullUrl}</loc>
        ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ""}
        ${route.changefreq ? `<changefreq>${route.changefreq}</changefreq>` : ""}
        ${route.priority ? `<priority>${route.priority}</priority>` : ""}
    </url>`;
        })
        .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlset}
</urlset>`;
};

// Generate robots.txt
const generateRobotsTxt = (sitemapUrl, disallowPaths = [], allowPaths = []) => {
    const baseUrl = SEO_CONSTANTS.SITE_URL;
    const fullSitemapUrl = sitemapUrl || `${baseUrl}/sitemap.xml`;

    let robotsTxt = "User-agent: *\n";

    // Add disallow paths
    disallowPaths.forEach((path) => {
        robotsTxt += `Disallow: ${path}\n`;
    });

    // Add allow paths
    allowPaths.forEach((path) => {
        robotsTxt += `Allow: ${path}\n`;
    });

    robotsTxt += `\nSitemap: ${fullSitemapUrl}`;

    return robotsTxt;
};

// Main function
const generateSEOFiles = () => {
    const projectRoot = join(__dirname, "..");
    const publicDir = join(projectRoot, "public");

    // Create public directory if it doesn't exist
    if (!existsSync(publicDir)) {
        mkdirSync(publicDir, { recursive: true });
    }

    try {
        // Generate sitemap.xml
        const sitemapXml = generateSitemap(SEO_CONSTANTS.SITE_URL, routes);
        const sitemapPath = join(publicDir, "sitemap.xml");
        writeFileSync(sitemapPath, sitemapXml, "utf8");
        console.log("✅ Sitemap.xml generated successfully at:", sitemapPath);

        // Generate robots.txt
        const robotsTxt = generateRobotsTxt(
            `${SEO_CONSTANTS.SITE_URL}/sitemap.xml`,
            ["/admin/*", "/api/*"], // Disallow paths
            [] // Allow paths
        );
        const robotsPath = join(publicDir, "robots.txt");
        writeFileSync(robotsPath, robotsTxt, "utf8");
        console.log("✅ Robots.txt generated successfully at:", robotsPath);

        console.log("\n📊 Generated files:");
        console.log(`- Sitemap: ${routes.length} URLs`);
        console.log(`- Base URL: ${SEO_CONSTANTS.SITE_URL}`);
        console.log(`- Last updated: ${new Date().toISOString()}`);
    } catch (error) {
        console.error("❌ Error generating SEO files:", error);
        process.exit(1);
    }
};

// Run the script
generateSEOFiles();
