import { useState, useEffect, useCallback } from 'react';
import type { AssignmentsOverview } from "../types";
import { getAssignmentOverview  } from "../api";
import toast from "react-hot-toast";

export const useAssignmentOverview = (courseId: string, classId: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [assignmentsOverview, setAssignmentsOverview] = useState<AssignmentsOverview | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger((prev) => prev + 1);
    }, [])

    useEffect(() => {
        const getAssignments = async () => {
            if (!courseId || !classId) return;

            setLoading(true);
            try {
                const record = await getAssignmentOverview(courseId, classId);
                setAssignmentsOverview(record);
            } catch (error : any) {
                const msg = error.response?.data?.message || error.message || "Error al cargar las asignaciones"
                toast.error(msg);
                console.error(msg);
            } finally {
                setLoading(false);
            }
        }
        getAssignments();
    }, [courseId, classId, trigger])

    return { assignmentsOverview, loading, refetch };
}