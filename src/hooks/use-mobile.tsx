"use client";
/**
 * @description Hook để kiểm tra xem người dùng đang sử dụng thiết bị di động hay không (cách đặt tên do shadcn/ui đặt)
 * @returns {boolean} true nếu người dùng đang sử dụng thiết bị di động, false nếu không
 */
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return !!isMobile;
}
