import {useEffect, useState} from "react";
import type {ClassFinalGrade} from "../../types/types.ts";
import {getStudentGrades} from "../../api";

export const useGrades = (studentId: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [grades, setGrades] = useState<ClassFinalGrade[]>([]);

    useEffect(() => {
        const fetchGrade = async () => {
            if(!studentId) return;

            setLoading(true);
            try {
                const response = await getStudentGrades(studentId);
                setGrades(response);
            } catch (error : any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchGrade();
    }, [])

    return { loading, grades };
}