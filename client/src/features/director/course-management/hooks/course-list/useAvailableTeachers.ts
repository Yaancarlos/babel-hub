import { useState, useEffect } from 'react';
import { getTeachers } from "../../api";
import axios from "axios";
import type { Teacher } from "../../types";

export const useAvailableTeachers = (id: string | null) => {
    const [loading, setLoading] = useState<Boolean>(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        const loadTeachers = async () => {
            setLoading(true);
            try {
                const url = id
                    ? `/teacher?available=true&includeTeacherId=${id}`
                    : '/teacher?available=true';

                const response: Teacher[] = await getTeachers(url, controller );
                setTeachers(response);
            } catch (error: any) {
                if (axios.isCancel(error) || (error as Error).name === 'AbortError') return;
                console.error("Error GETTING available teachers", error);
            } finally {
                setLoading(false);
            }
        }
        loadTeachers();

        return () => controller.abort();
    }, [id]);

    return { loading, teachers };
}