import { type FC, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryProviderProps {
    children: ReactNode;
}

// Tạo QueryClient với cấu hình tối ưu
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Time in milliseconds
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: (failureCount, error: any) => {
                // Không retry cho lỗi 4xx
                if (error?.response?.status >= 400 && error?.response?.status < 500) {
                    return false;
                }
                // Retry tối đa 3 lần cho các lỗi khác
                return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: false,
        },
    },
});

export const QueryProvider: FC<QueryProviderProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Chỉ hiển thị devtools trong development */}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
};

export { queryClient };
