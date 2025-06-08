"use client";
/**
 * @description Hook để kiểm tra xem người dùng đã click ngoài một phần tử hay chưa
 * @param {React.RefObject<HTMLElement>} ref Ref của phần tử cần kiểm tra
 * @param {() => void} callback Callback khi người dùng click ngoài phần tử
 */
import { useEffect } from "react";

export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
};
