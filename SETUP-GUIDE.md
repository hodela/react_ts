# Hướng dẫn Setup Router DOM, TanStack Query và Axios

## 🚀 Setup hoàn tất

Dự án đã được cấu hình với:

- ✅ **React Router DOM** - Client-side routing với lazy loading
- ✅ **TanStack Query** - Server state management
- ✅ **Axios** - HTTP client với interceptors
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS** - Styling
- ✅ **Font Inter** - Typography
- ✅ **React i18next** - Đa ngôn ngữ (Tiếng Việt/English)
- ✅ **SEO Optimization** - Meta tags, Open Graph, Schema.org
- ✅ **Multilingual SEO** - Hreflang, locale-aware meta tags

## 📁 Cấu trúc thư mục

```
src/
├── api/                    # API configuration
│   ├── client.ts          # Axios instance với interceptors
│   └── services/          # API services
│       ├── auth.service.ts # Authentication services
│       └── user.service.ts # User services
├── components/            # Reusable components
│   ├── ui/                # UI components
│   ├── shared/            # Shared components
│   ├── home/              # Home components
│   ├── auth/              # Auth components
│   └── ...                # Other components
├── hooks/                 # Custom hooks
│   ├── useAuth.ts        # Authentication hook
│   └── useDebounce.ts     # Debounce hook
│   └── useClickOutside.ts # Click outside hook
│   └── useScroll.ts       # Scroll hook
│   └── use-mobile.tsx     # Mobile hook
├── layouts/              # Layout components
│   ├── RootLayout.tsx    # Main app layout
│   └── AuthLayout.tsx    # Auth pages layout
├── pages/                # Page components
│   ├── HomePage.tsx      # Home page
│   ├── NotFoundPage.tsx  # Not found page
│   └── auth/
│       ├── LoginPage.tsx # Login page
│       └── RegisterPage.tsx # Register page
│       └── ForgotPasswordPage.tsx # Forgot password page
│       └── ResetPasswordPage.tsx # Reset password page
│       └── VerifyEmailPage.tsx # Verify email page
│       └── VerifyEmailSuccessPage.tsx # Verify email success page
│       └── VerifyEmailFailedPage.tsx # Verify email failed page
│       └── VerifyEmailExpiredPage.tsx # Verify email expired page
├── providers/            # Context providers
│   └── QueryProvider.tsx # TanStack Query provider
├── router/               # Routing configuration
│   └── index.tsx         # Router setup
├── types/                # TypeScript types
│   └── api.ts           # API related types
├── App.tsx
├── main.tsx
├── styles.css
├── .env.example
├── .cursorignore
├── .cursorrules
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── .env.example
├── postcss.config.js
├── tailwind.config.js
```

## 🔧 Cấu hình Environment Variables

1. Đổi tên `.env.example` thành `.env`:

    ```bash
    mv .env.example .env
    ```

2. Cập nhật các giá trị trong `.env` theo môi trường của bạn:
    ```env
    VITE_API_BASE_URL=http://localhost:3000/api
    VITE_APP_NAME=MyApp
    # ... other variables
    ```

## 🏃‍♂️ Chạy ứng dụng

```bash
npm run dev
```

## 📖 Cách sử dụng

### 1. API Services

```typescript
// Sử dụng services
import { userService } from "@/api/services/user.service";
import { authService } from "@/api/services/auth.service";

// Get users
const users = await userService.getUsers(1, 10);

// Login
const loginResult = await authService.login({
    email: "user@example.com",
    password: "password",
});
```

### 2. TanStack Query Hooks

```typescript
// Trong component
import { useQuery, useMutation } from '@tanstack/react-query';

const MyComponent = () => {
  // Query data
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });

  // Mutation
  const createUserMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      // Refetch users after creation
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    // Your JSX
  );
};
```

### 3. Authentication Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

const LoginComponent = () => {
  const { login, isLoggingIn, loginError } = useAuth();

  const handleLogin = (credentials) => {
    login(credentials);
  };

  return (
    // Login form JSX
  );
};
```

### 4. Router Navigation

```typescript
import { useNavigate, Link } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <Link to="/about">About</Link>
      <button onClick={goToDashboard}>Go to Dashboard</button>
    </div>
  );
};
```

## 🔒 Authentication Flow

### Token Strategy

- **Access Token**: Có hiệu lực 4 giờ, dùng cho các API calls
- **Refresh Token**: Có hiệu lực 30 ngày, dùng để làm mới access token

### Flow chi tiết:

1. **Login thành công**:

    - Server trả về `access_token` (4h) và `refresh_token` (30d)
    - Lưu cả 2 tokens vào localStorage với timestamp

2. **API Request bình thường**:

    - Axios interceptor tự động thêm `access_token` vào headers
    - Request được thực hiện thành công

3. **Khi Access Token hết hạn**:

    - API trả về 401 Unauthorized
    - Axios response interceptor tự động:
        - Pause tất cả pending requests
        - Gọi refresh token API với `refresh_token`
        - Nhận `access_token` mới từ server
        - Cập nhật token trong localStorage
        - Retry tất cả failed requests với token mới
        - Resume normal operations

4. **Khi Refresh Token hết hạn**:

    - Refresh token API trả về 401/403
    - Tự động logout user
    - Clear tokens khỏi localStorage
    - Redirect về login page
    - Hiển thị thông báo "Phiên đăng nhập đã hết hạn"

5. **Token Refresh tự động**:
    - Check token expiry trước mỗi request
    - Tự động refresh nếu token sắp hết hạn (còn < 5 phút)
    - Đảm bảo user không bao giờ gặp lỗi 401

### Ưu điểm:

- **Bảo mật cao**: Access token có thời gian sống ngắn
- **UX mượt mà**: User không bị logout đột ngột
- **Transparent**: Refresh process hoàn toàn tự động, user không nhận ra
- **Retry mechanism**: Failed requests được tự động retry sau khi refresh token

## 🎨 Styling với Tailwind

Tất cả components đã được style với Tailwind CSS và font Inter. Bạn có thể:

- Sử dụng classes có sẵn: `bg-blue-600`, `text-white`, etc.
- Tạo custom components trong `src/components/`
- Responsive design: `md:grid-cols-2`, `lg:grid-cols-3`

## 🚀 Tính năng nâng cao

- **Lazy Loading**: Tất cả pages được lazy load
- **Error Boundaries**: Xử lý lỗi ở route level
- **Loading States**: Loading spinners tự động
- **Caching**: TanStack Query cache với stale time
- **Retry Logic**: Auto retry cho failed requests
- **Type Safety**: Full TypeScript support

## 🔗 API Specification

Dưới đây là chi tiết các API endpoints cần thiết để hệ thống hoạt động hoàn chỉnh:

### Base Configuration

```
Base URL: http://localhost:3000/api (hoặc theo VITE_API_BASE_URL)
Content-Type: application/json
Authorization: Bearer {access_token} (cho protected routes)
```

### 🔐 Authentication APIs

#### 1. Login

```http
POST /auth/login
```

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response (200):**

```json
{
    "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg",
        "theme": "light",
        "language": "en",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 14400,
    "tokenType": "Bearer"
}
```

**Error Responses:**

```json
// 401 - Invalid credentials
{
  "message": "Đăng nhập thất bại",
  "code": "LOGIN_FAILED",
  "details": {
    "email": ["Email hoặc mật khẩu không đúng"]
  }
}

// 422 - Validation error
{
  "message": "Dữ liệu không hợp lệ",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": ["Email không hợp lệ"],
    "password": ["Mật khẩu không được để trống"]
  }
}
```

#### 2. Get Current User

```http
GET /auth/me
Headers: Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "theme": "light",
    "language": "en",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Response (401):**

```json
{
    "message": "Không thể lấy thông tin user",
    "code": "GET_USER_FAILED"
}
```

#### 3. Refresh Token

```http
POST /auth/refresh
```

**Request Body:**

```json
{
    "refreshToken": "jwt-refresh-token"
}
```

**Response (200):**

```json
{
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-jwt-refresh-token",
    "expiresIn": 14400,
    "tokenType": "Bearer"
}
```

**Error Response (401):**

```json
{
    "message": "Không thể làm mới token",
    "code": "REFRESH_TOKEN_FAILED",
    "details": {
        "refreshToken": ["Refresh token không hợp lệ hoặc đã hết hạn"]
    }
}
```

#### 4. Logout

```http
POST /auth/logout
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "refreshToken": "jwt-refresh-token"
}
```

**Response (200):**

```json
{
    "message": "Đăng xuất thành công"
}
```

#### 5. Register

```http
POST /auth/register
```

**Request Body:**

```json
{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User",
    "confirmPassword": "password123"
}
```

**Response (201):**

```json
{
    "user": {
        "id": "uuid-string",
        "email": "newuser@example.com",
        "name": "New User",
        "avatar": null,
        "theme": "light",
        "language": "en",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    "message": "Đăng ký thành công",
    "requiresVerification": true
}
```

**Error Response (400):**

```json
{
    "message": "Đăng ký thất bại",
    "code": "REGISTER_FAILED",
    "details": {
        "email": ["Email đã tồn tại"],
        "password": ["Mật khẩu phải có ít nhất 8 ký tự"]
    }
}
```

#### 6. Forgot Password

```http
POST /auth/forgot-password
```

**Request Body:**

```json
{
    "email": "user@example.com"
}
```

**Response (200):**

```json
{
    "message": "Email khôi phục mật khẩu đã được gửi"
}
```

**Error Response (400):**

```json
{
    "message": "Gửi email khôi phục thất bại",
    "code": "FORGOT_PASSWORD_FAILED",
    "details": {
        "email": ["Email không tồn tại trong hệ thống"]
    }
}
```

#### 7. Reset Password

```http
POST /auth/reset-password
```

**Request Body:**

```json
{
    "token": "reset-token-from-email",
    "password": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

**Response (200):**

```json
{
    "message": "Đặt lại mật khẩu thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Đặt lại mật khẩu thất bại",
    "code": "RESET_PASSWORD_FAILED",
    "details": {
        "token": ["Token không hợp lệ hoặc đã hết hạn"],
        "password": ["Mật khẩu phải có ít nhất 8 ký tự"]
    }
}
```

#### 8. Verify Email

```http
POST /auth/verify-email
```

**Request Body:**

```json
{
    "token": "verify-token-from-email"
}
```

**Response (200):**

```json
{
    "message": "Xác thực email thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Xác thực email thất bại",
    "code": "VERIFY_EMAIL_FAILED",
    "details": {
        "token": ["Token không hợp lệ hoặc đã hết hạn"]
    }
}
```

### 👥 User APIs

#### 1. Get Profile

```http
GET /users/profile
Headers: Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "theme": "light",
    "language": "en",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Response (401):**

```json
{
    "message": "Không thể lấy thông tin profile",
    "code": "GET_PROFILE_FAILED"
}
```

#### 2. Update Profile

```http
PUT /users/profile
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "name": "Updated Name",
    "avatar": "https://example.com/new-avatar.jpg",
    "theme": "light",
    "language": "en"
}
```

**Response (200):**

```json
{
    "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "name": "Updated Name",
        "avatar": "https://example.com/new-avatar.jpg",
        "theme": "light",
        "language": "en",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    "message": "Cập nhật profile thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Cập nhật profile thất bại",
    "code": "UPDATE_PROFILE_FAILED",
    "details": {
        "name": ["Tên không được để trống"],
        "avatar": ["Avatar không hợp lệ"]
    }
}
```

#### 3. Change Password

```http
PUT /users/change-password
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "oldPassword": "oldpassword123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

**Response (200):**

```json
{
    "message": "Thay đổi mật khẩu thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Thay đổi mật khẩu thất bại",
    "code": "CHANGE_PASSWORD_FAILED",
    "details": {
        "oldPassword": ["Mật khẩu cũ không đúng"],
        "newPassword": ["Mật khẩu mới phải có ít nhất 8 ký tự"]
    }
}
```

#### 4. Upload Avatar

```http
POST /users/upload-avatar
Headers: Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**

```json
{
    "avatar": "file-object"
}
```

**Response (200):**

```json
{
    "avatarUrl": "https://example.com/avatars/new-avatar.jpg"
}
```

**Error Response (400):**

```json
{
    "message": "Upload avatar thất bại",
    "code": "UPLOAD_AVATAR_FAILED",
    "details": {
        "avatar": ["File không hợp lệ", "Kích thước file quá lớn"]
    }
}
```

#### 5. Delete Avatar

```http
DELETE /users/avatar
Headers: Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
    "message": "Xóa avatar thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Xóa avatar thất bại",
    "code": "DELETE_AVATAR_FAILED"
}
```

#### 6. Update Theme

```http
PATCH /users/theme
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "theme": "dark"
}
```

**Response (200):**

```json
{
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "theme": "dark",
    "language": "en",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Response (400):**

```json
{
    "message": "Cập nhật theme thất bại",
    "code": "UPDATE_THEME_FAILED",
    "details": {
        "theme": ["Theme phải là 'light', 'dark' hoặc 'system'"]
    }
}
```

#### 7. Update Language

```http
PATCH /users/language
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "language": "vi"
}
```

**Response (200):**

```json
{
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "theme": "light",
    "language": "vi",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Response (400):**

```json
{
    "message": "Cập nhật ngôn ngữ thất bại",
    "code": "UPDATE_LANGUAGE_FAILED",
    "details": {
        "language": ["Ngôn ngữ phải là 'vi' hoặc 'en'"]
    }
}
```

### ⚠️ Error Handling

Tất cả API sẽ trả về HTTP status codes phù hợp:

- **200**: Success
- **201**: Created
- **400**: Bad Request - Dữ liệu request không hợp lệ
- **401**: Unauthorized - Chưa đăng nhập hoặc token không hợp lệ
- **403**: Forbidden - Không có quyền truy cập
- **404**: Not Found - Không tìm thấy resource
- **422**: Unprocessable Entity - Validation errors
- **500**: Internal Server Error - Lỗi server

**Error Response Format:**

```json
{
    "message": "Mô tả lỗi bằng tiếng Việt",
    "code": "ERROR_CODE",
    "details": {
        // Optional - chi tiết lỗi validation
    }
}
```

### 🔧 Backend Implementation Notes

#### Database Schema Example (User table):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar TEXT,
  theme VARCHAR(255) DEFAULT 'light',
  language VARCHAR(255) DEFAULT 'en',
  role VARCHAR(255) DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  verification_token_expires_at TIMESTAMP,
  reset_password_token TEXT,
  reset_password_token_expires_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### JWT Token Configuration:

- **Access Token**: 4 giờ (14400 seconds)
- **Refresh Token**: 30 ngày (2592000 seconds)
- **Algorithm**: HS256 hoặc RS256
- **Secret**: Lưu trong environment variables

#### Environment Variables cần thiết:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT
JWT_SECRET=your-super-secure-secret-key
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_ACCESS_EXPIRES_IN=4h
JWT_REFRESH_EXPIRES_IN=30d

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App
PORT=3000
NODE_ENV=development
```

## 🌐 Đa ngôn ngữ (Internationalization - i18n)

### Cấu hình i18n

Dự án đã được cấu hình với **react-i18next** để hỗ trợ đa ngôn ngữ:

- ✅ **Tiếng Việt (vi)** - Ngôn ngữ mặc định
- ✅ **Tiếng Anh (en)** - Ngôn ngữ phụ
- ✅ **Auto-detection** - Tự động phát hiện ngôn ngữ từ browser
- ✅ **LocalStorage** - Lưu trữ lựa chọn ngôn ngữ
- ✅ **SEO-friendly** - Hỗ trợ hreflang và meta tags đa ngôn ngữ

### Cấu trúc Translation Files

```
src/i18n/
├── index.ts              # Cấu hình i18next
└── locales/
    ├── en.json          # Translation tiếng Anh
    └── vi.json          # Translation tiếng Việt
```

### Sử dụng Translation trong Components

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();

  // Sử dụng translation
  const title = t('auth.login.title'); // "Đăng nhập" hoặc "Sign In"

  // Thay đổi ngôn ngữ
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
    </div>
  );
};
```

### SEO Đa ngôn ngữ

Tất cả các trang đã được tích hợp SEO đa ngôn ngữ:

```typescript
import { generateAuthPageSEO } from '@/lib/seo-utils';

const LoginPage = () => {
  const { t } = useTranslation();
  const seoData = generateAuthPageSEO('login', t);

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        schema={seoData.schema}
      />
      {/* Page content */}
    </>
  );
};
```

### Tính năng SEO đa ngôn ngữ:

- **Hreflang tags**: `<link rel="alternate" hrefLang="vi" href="..." />`
- **Open Graph locale**: `<meta property="og:locale" content="vi_VN" />`
- **Language-aware meta tags**: Tự động thay đổi theo ngôn ngữ hiện tại
- **Structured data**: Schema.org với ngôn ngữ phù hợp

### Translation Keys Structure

```json
{
    "common": {
        "loading": "Đang tải...",
        "error": "Lỗi",
        "success": "Thành công"
    },
    "auth": {
        "login": {
            "title": "Đăng nhập",
            "subtitle": "Nhập thông tin để truy cập tài khoản",
            "seo": {
                "title": "Đăng nhập",
                "description": "Đăng nhập vào tài khoản...",
                "keywords": "đăng nhập, xác thực..."
            }
        }
    }
}
```

### Thêm Translation Key mới

1. **Thêm vào file tiếng Việt** (`src/i18n/locales/vi.json`):

```json
{
    "newFeature": {
        "title": "Tính năng mới",
        "description": "Mô tả tính năng"
    }
}
```

2. **Thêm vào file tiếng Anh** (`src/i18n/locales/en.json`):

```json
{
    "newFeature": {
        "title": "New Feature",
        "description": "Feature description"
    }
}
```

3. **Sử dụng trong component**:

```typescript
const title = t("newFeature.title");
```

### Best Practices

1. **Namespace organization**: Tổ chức keys theo tính năng
2. **Consistent naming**: Sử dụng camelCase cho keys
3. **SEO keys**: Luôn có `seo.title`, `seo.description`, `seo.keywords`
4. **Fallback**: Luôn có fallback cho missing keys
5. **Pluralization**: Sử dụng i18next pluralization cho số đếm

### URL Structure cho SEO

Hiện tại sử dụng cùng URL cho cả hai ngôn ngữ với hreflang tags.
Có thể mở rộng thành:

```
/vi/auth/login    # Tiếng Việt
/en/auth/login    # Tiếng Anh
/auth/login       # Default (redirect based on browser)
```

## 📝 Next Steps

1. Kết nối với backend API thực tế
2. Thêm form validation (React Hook Form + Zod)
3. Implement protected routes
4. Thêm unit tests (Vitest + React Testing Library)
5. Setup CI/CD pipeline
6. Add error tracking (Sentry)
7. Implement push notifications
8. Thêm language switcher component vào header
9. Implement URL-based language routing (optional)
10. Add more languages (optional)
