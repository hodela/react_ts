import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

// Lazy load components để tối ưu performance
import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AuthDemo = lazy(() => import("@/pages/AuthDemo"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));
const VerifyEmailSuccessPage = lazy(() => import("@/pages/auth/VerifyEmailSuccessPage"));
const VerifyEmailFailedPage = lazy(() => import("@/pages/auth/VerifyEmailFailedPage"));
const VerifyEmailExpiredPage = lazy(() => import("@/pages/auth/VerifyEmailExpiredPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "auth-demo",
                element: <AuthDemo />,
            },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            {
                path: "forgot-password",
                element: <ForgotPasswordPage />,
            },
            {
                path: "reset-password",
                element: <ResetPasswordPage />,
            },
            {
                path: "verify-email",
                element: <VerifyEmailPage />,
            },
            {
                path: "verify-email-success",
                element: <VerifyEmailSuccessPage />,
            },
            {
                path: "verify-email-failed",
                element: <VerifyEmailFailedPage />,
            },
            {
                path: "verify-email-expired",
                element: <VerifyEmailExpiredPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);
