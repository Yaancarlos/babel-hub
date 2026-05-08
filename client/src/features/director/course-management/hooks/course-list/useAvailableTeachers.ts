import { useState, useEffect } from 'react';
import { getTeachers } from "../../api";
import axios from "axios";

export const useAvailableTeachers = (id: string | undefined) => {
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState<any[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        const loadTeachers = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const url = id
                    ? `/teacher?available=true&includeTeacherId=${id}`
                    : '/teacher?available=true';

                const response = await getTeachers(url, controller );
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