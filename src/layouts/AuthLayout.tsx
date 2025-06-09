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
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <Link to="/" className="flex justify-center">
                    <img src="/logo.svg" alt="MyApp" className="w-auto h-10" />
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-6">
                <div className="bg-card py-8 px-8 shadow-xl rounded-xl sm:px-10 border border-border">
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
