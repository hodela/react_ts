import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { Loader2 } from "lucide-react";
import { type FC, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, Link, useLocation } from "react-router-dom";

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
    </div>
);

export const RootLayout: FC = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const navigation = [
        { name: t("navigation.home"), path: "/" },
        { name: t("navigation.demoAuth"), path: "/auth-demo" },
        { name: t("navigation.notFound"), path: "/some-page-that-does-not-exist" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-xl font-bold text-gray-900">
                                MyApp
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:block">
                            <div className="flex space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            location.pathname === item.path
                                                ? "text-blue-600 bg-blue-50"
                                                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <LanguageSelector />
                            {/* Auth buttons */}
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/auth/login"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    {t("navigation.login")}
                                </Link>
                                <Link
                                    to="/auth/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {t("navigation.register")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center">
                <Suspense fallback={<LoadingSpinner />}>
                    <Outlet />
                </Suspense>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">© 2025 MyApp. {t("footer.copyright")}</p>
                </div>
            </footer>
        </div>
    );
};
