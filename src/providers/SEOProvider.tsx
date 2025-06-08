import type { FC, ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";

interface SEOProviderProps {
    children: ReactNode;
}

export const SEOProvider: FC<SEOProviderProps> = ({ children }) => {
    return <HelmetProvider context={{}}>{children}</HelmetProvider>;
};
