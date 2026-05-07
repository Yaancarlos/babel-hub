import { useState, useEffect } from "react";
import { getCLasses, getCourse } from "../api";
import type { TeacherClass, TeacherCourse } from "../types";

export const useTeacherClasses = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<TeacherClass[]>([]);
    const [course, setCourse] = useState<TeacherCourse>();
    const [error, setError] = useState('');

    useEffect(() => {
        const loadTeacherData = async () => {
            setLoading(true);
            try {
                const teacherClasses = await getCLasses();
                setClasses(teacherClasses);

                const teacherCourse = await getCourse();
                setCourse(teacherCourse);
            } catch (error : any) {
                setError(error || "Error al cargar las clases del profesor");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadTeacherData();
    }, []);

    return { loading, error, classes, course };
}