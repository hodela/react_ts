import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "@/providers/QueryProvider";
import { SEOProvider } from "@/providers/SEOProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { router } from "@/router";

function App() {
    return (
        <SEOProvider>
            <QueryProvider>
                <LanguageProvider>
                    <RouterProvider router={router} />
                </LanguageProvider>
            </QueryProvider>
        </SEOProvider>
    );
}

export default App;
