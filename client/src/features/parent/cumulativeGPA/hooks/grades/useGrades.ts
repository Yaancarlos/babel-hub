import {useEffect, useState} from "react";
import type {ClassFinalGrade} from "../../types/types.ts";
import {getStudentGrades} from "../../api";

export const useGrades = (studentId: string, periodId: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [grades, setGrades] = useState<ClassFinalGrade[]>([]);

    useEffect(() => {
        const fetchGrade = async () => {
            if(!studentId || !periodId) return;

            setLoading(true);
            try {
                const response = await getStudentGrades(studentId, periodId);
                setGrades(response);
            } catch (error : any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchGrade();
    }, [periodId, studentId]);

    return { loading, grades };
}