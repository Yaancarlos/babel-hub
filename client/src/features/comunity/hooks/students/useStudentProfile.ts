import { useState, useEffect } from "react";
import {getStudentById} from "../../api";
import type {GradeRecord} from "../../types";

interface StudentProfileData {
    id: string;
    full_name: string;
    email: string;
    course_name: string;
    enrollment_code: string;
    recent_grades: GradeRecord[];
}

export const useStudentProfile = (id: string | undefined) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<StudentProfileData>();

    useEffect(() => {
        const loadProfile = async () => {
            if (!id) return;

            try {
                const response = await getStudentById(id);
                setData(response);
            } catch (error : any) {
                console.error("Error GETTING the student info", error);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [id])

    return { loading, data }
}