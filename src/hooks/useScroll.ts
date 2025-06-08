"use client";
/**
 * @description Hook để kiểm tra xem người dùng đã cuộn trang hay chưa
 * @returns {boolean} true nếu người dùng đã cuộn trang, false nếu không
 */
import { useEffect, useState } from "react";

export const useScroll = () => {
    const [isScrolling, setIsScrolling] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return isScrolling;
};
