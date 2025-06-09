import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

// Lazy load components để tối ưu performance
import { lazy } from "react";
import { AccountLayout } from "@/layouts/AccountLayout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AuthDemo = lazy(() => import("@/pages/AuthDemo"));
const ComponentsDemo = lazy(() => import("@/pages/ComponentsDemo"));
const AccountInfoPage = lazy(() => import("@/pages/account/AccountInfoPage"));
const ChangePasswordPage = lazy(() => import("@/pages/account/ChangePasswordPage"));
const SettingsPage = lazy(() => import("@/pages/account/SettingsPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));
const VerifyEmailSuccessPage = lazy(() => import("@/pages/auth/VerifyEmailSuccessPage"));
const VerifyEmailFailedPage = lazy(() => import("@/pages/auth/VerifyEmailFailedPage"));
const VerifyEmailExpiredPage = lazy(() => import("@/pages/auth/VerifyEmailExpiredPage"));
const ResendVerificationPage = lazy(() => import("@/pages/auth/ResendVerificationPage"));
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
            {
                path: "components-demo",
                element: <ComponentsDemo />,
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
            {
                path: "resend-verification",
                element: <ResendVerificationPage />,
            },
        ],
    },
    {
        path: "/account",
        element: <AccountLayout />,
        children: [
            {
                index: true,
                element: <AccountInfoPage />,
            },
            {
                path: "change-password",
                element: <ChangePasswordPage />,
            },
            {
                path: "settings",
                element: <SettingsPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);
