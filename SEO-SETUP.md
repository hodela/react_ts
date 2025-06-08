# SEO Setup Guide

## Tổng quan

Dự án đã được tích hợp đầy đủ các tính năng SEO cần thiết để tối ưu hóa cho các công cụ tìm kiếm và mạng xã hội.

## Các tính năng đã được bổ sung

### 1. React Helmet Async

- Quản lý meta tags động
- Hỗ trợ Server-Side Rendering (SSR)
- Tự động cleanup meta tags

### 2. SEO Components & Hooks

#### SEOProvider

Wrap toàn bộ ứng dụng để cung cấp context cho Helmet.

```tsx
import { SEOProvider } from "@/providers/SEOProvider";

function App() {
    return <SEOProvider>{/* Your app content */}</SEOProvider>;
}
```

#### SEO Component

Component chính để thiết lập meta tags cho từng trang.

```tsx
import { SEO } from "@/components/SEO/SEO";
import { generatePageTitle, generateWebsiteSchema } from "@/lib/seo-utils";

const MyPage = () => {
    const pageTitle = generatePageTitle("Trang chủ");
    const websiteSchema = generateWebsiteSchema();
    return (
        <>
            <SEO
                title={pageTitle}
                description="Mô tả trang"
                keywords="từ khóa, seo, react"
                image="/og-image.jpg"
                canonical="https://yoursite.com/page"
                schema={websiteSchema}
            />
            {/* Page content */}
        </>
    );
};
```

### 3. SEO Utilities

#### Tạo Structured Data

```tsx
import { generateWebsiteSchema, generateArticleSchema, generateOrganizationSchema } from "@/lib/seo-utils";

// Website schema
const websiteSchema = generateWebsiteSchema();

// Article schema
const articleSchema = generateArticleSchema({
    title: "Tiêu đề bài viết",
    description: "Mô tả bài viết",
    image: "/article-image.jpg",
    author: "Tác giả",
    publishedTime: "2024-01-01T00:00:00Z",
    url: "https://yoursite.com/article",
});
```

#### Tạo Title và Meta Description

```tsx
import { generatePageTitle, generateMetaDescription } from "@/lib/seo-utils";

const title = generatePageTitle("Trang chủ"); // "Trang chủ | React App"
const description = generateMetaDescription("Mô tả dài...", 160);
```

### 4. Sitemap Generator

Sitemap và robots.txt sẽ được tự động tạo và lưu vào thư mục `public/` khi build hoặc chạy lệnh `npm run seo:generate`. Bạn có thể cập nhật danh sách url vào file `scripts/generate-seo-files.js`.

## Cấu hình

### 1. Cập nhật SEO Constants

Chỉnh sửa file `src/constants/seo.ts`:

```typescript
export const SEO_CONSTANTS = {
    SITE_NAME: "Tên website của bạn",
    SITE_URL: "https://yourdomain.com",
    SITE_DESCRIPTION: "Mô tả website",
    SITE_KEYWORDS: "từ khóa, của, bạn",
    SITE_AUTHOR: "Tên tác giả",
    TWITTER_HANDLE: "@your_twitter",
    // ...
};
```

### 2. Thêm Images

Thêm các file image cần thiết vào thư mục `public/`:

- `og-image.jpg` (1200x630px) - Open Graph image
- `logo.png` - Logo cho structured data
- `favicon.ico` - Favicon

### 3. Cập nhật index.html

File `index.html` đã được cập nhật với các meta tags cơ bản. Bạn có thể tùy chỉnh thêm.

## Sử dụng trong Pages

### Trang cơ bản

```tsx
import { SEO } from "@/components/SEO/SEO";
import { generatePageTitle, generateWebsiteSchema } from "@/lib/seo-utils";

const AboutPage = () => {
    const pageTitle = generatePageTitle("Về chúng tôi");
    const websiteSchema = generateWebsiteSchema();
    return (
        <>
            <SEO
                title={pageTitle}
                description="Tìm hiểu về công ty và đội ngũ của chúng tôi"
                keywords="về chúng tôi, công ty, đội ngũ"
                schema={websiteSchema}
            />
            <div>
                <h1>Về chúng tôi</h1>
                {/* Content */}
            </div>
        </>
    );
};
```

### Trang bài viết

```tsx
import { SEO } from "@/components/SEO/SEO";
import { generateArticleSchema } from "@/lib/seo-utils";

const ArticlePage = ({ article }) => {
    const articleSchema = generateArticleSchema({
        title: article.title,
        description: article.excerpt,
        image: article.image,
        author: article.author,
        publishedTime: article.publishedAt,
        url: `https://yoursite.com/articles/${article.slug}`,
    });

    return (
        <>
            <SEO
                title={article.title}
                description={article.excerpt}
                keywords={article.tags.join(", ")}
                type="article"
                image={article.image}
                publishedTime={article.publishedAt}
                modifiedTime={article.updatedAt}
                schema={articleSchema}
            />
            <article>
                <h1>{article.title}</h1>
                {/* Article content */}
            </article>
        </>
    );
};
```

## Testing SEO

### 1. Công cụ kiểm tra

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 2. Kiểm tra trong Dev Tools

- Xem source code trang để kiểm tra meta tags
- Kiểm tra structured data trong Console
- Sử dụng React DevTools để xem Helmet data

## Best Practices

### 1. Title Tags

- Độ dài: 50-60 ký tự
- Chứa từ khóa chính
- Unique cho mỗi trang
- Dạng: "Trang chủ | Tên website"

### 2. Meta Description

- Độ dài: 150-160 ký tự
- Mô tả ngắn gọn, hấp dẫn
- Chứa từ khóa chính
- Call-to-action rõ ràng

### 3. Keywords

- 3-5 từ khóa chính
- Liên quan đến nội dung trang
- Không spam keywords

### 4. Images

- Open Graph: 1200x630px
- Alt text cho tất cả images
- Optimize file size
- Sử dụng WebP format

### 5. Structured Data

- Sử dụng schema.org
- Test với Google Rich Results
- Phù hợp với nội dung trang

## Monitoring

### 1. Google Search Console

- Submit sitemap
- Monitor search performance
- Check for crawl errors

### 2. Google Analytics

- Track organic traffic
- Monitor user behavior
- Set up conversion goals

### 3. Tools

- SEMrush
- Ahrefs
- Moz
- Screaming Frog

## Troubleshooting

### 1. Meta tags không hiển thị

- Kiểm tra SEOProvider đã wrap App chưa
- Xem có conflict với meta tags khác không
- Kiểm tra React Helmet dependencies

### 2. Structured data không hợp lệ

- Test với Google Rich Results Test
- Kiểm tra JSON-LD syntax
- Đảm bảo schema phù hợp với content

### 3. Open Graph không hoạt động

- Kiểm tra URL image có accessible không
- Xem có conflict với meta tags khác không
- Test với Facebook Debugger

## Deployment

### 1. Production Build

```bash
npm run build
```

### 2. Static Files

Đảm bảo các file sau có trong thư mục `public/`:

- `sitemap.xml`
- `robots.txt`
- `og-image.jpg`
- `favicon.ico`

### 3. Server Configuration

- Serve static files correctly
- Set up proper redirects
- Enable GZIP compression
- Configure caching headers

## Tài liệu tham khảo

- [React Helmet Async](https://github.com/staylor/react-helmet-async)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
