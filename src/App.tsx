import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "@/providers/QueryProvider";
import { SEOProvider } from "@/providers/SEOProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { router } from "@/router";
import { Toaster } from "sonner";

function App() {
    return (
        <ThemeProvider>
            <SEOProvider>
                <QueryProvider>
                    <LanguageProvider>
                        <RouterProvider router={router} />
                        <Toaster richColors />
                    </LanguageProvider>
                </QueryProvider>
            </SEOProvider>
        </ThemeProvider>
    );
}

export default App;
