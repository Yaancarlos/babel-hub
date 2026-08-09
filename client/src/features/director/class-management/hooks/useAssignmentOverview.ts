import { useState, useEffect } from 'react';
import type { AssignmentsOverview } from "../types";
import { getAssignmentOverview } from "../api";
import toast from "react-hot-toast";

export const useAssignmentOverview = (courseId: string, classId: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [assignments, setAssignments] = useState<AssignmentsOverview[]>([]);

    useEffect(() => {
        const getAssignments = async () => {
            if (!courseId || !classId) return;

            setLoading(true);
            try {
                const records = await getAssignmentOverview(courseId, classId);
                setAssignments(records);
            } catch (error : any) {
                const msg = error.response?.data?.message || error.message || "Error al cargar los trabajos"
                toast.error(msg);
                console.error(msg);
            } finally {
                setLoading(false);
            }
        }
        getAssignments();
    }, [])

    return { assignments, loading };
}