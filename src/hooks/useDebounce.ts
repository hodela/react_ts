"use client";
/**
 * @description Hook để debounce giá trị
 * @param {T} value Giá trị cần debounce
 * @param {number} delay Thời gian debounce
 * @returns {T} Giá trị đã debounce
 */
import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};
