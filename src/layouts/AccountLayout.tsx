import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
    </div>
);

export const AccountLayout = () => {
    // only logged in user can access this layout
    const { isAuthenticated, isLoadingUser } = useAuth();
    if (isLoadingUser) {
        return <LoadingSpinner />;
    }
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="container mx-auto flex-1 flex flex-col items-center justify-center">
                <Suspense fallback={<LoadingSpinner />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};
