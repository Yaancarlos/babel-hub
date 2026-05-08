import { useState, useEffect } from "react";
import type { ClassDetailsData } from "../types";
import { getTeacherClass } from "../api";
import axios from "axios";

export const useClassData = (classId: string) => {
    const [loading, setLoading] = useState(false);
    const [classData, setClassData] = useState<ClassDetailsData>();

    useEffect(() => {
        const controller = new AbortController();

        const loadClassData = async () => {
            if (!classId) return;

            setLoading(true);
            try {
                const teacherClass: ClassDetailsData = await getTeacherClass(classId, controller);
                setClassData(teacherClass);
            } catch (error : any) {
                if (axios.isCancel(error) || error.name === 'AbortError') return;
                console.error("Error loading class and attendance:", error);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }
        loadClassData();

        return () => controller.abort();
    }, [classId]);

    return { loading, classData };
}