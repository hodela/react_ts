import { ArrowLeft, Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Outlet, Link } from "react-router-dom";

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
    </div>
);

export const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <Link to="/" className="flex justify-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MyApp</h1>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-200 dark:border-gray-700">
                    <Suspense fallback={<LoadingSpinner />}>
                        <Outlet />
                    </Suspense>
                </div>

                {/* Back to home link */}
                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Quay về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};
