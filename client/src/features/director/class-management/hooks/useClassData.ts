import { useState, useEffect } from "react";
import type { ClassDetailsData } from "../types";
import { getClass } from "../api";

// Testing bro

export const useClassData = (classId: string) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState <ClassDetailsData | null>(null);

    useEffect(() => {
        if (!classId) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const response = await getClass(classId);
                setData(response);
            } catch (error) {
                console.error("Error GETTING class details", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [classId]);

    return { data, loading };
}