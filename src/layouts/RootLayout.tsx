import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
    </div>
);

export const RootLayout = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <Header />

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center">
                <Suspense fallback={<LoadingSpinner />}>
                    <Outlet />
                </Suspense>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};
