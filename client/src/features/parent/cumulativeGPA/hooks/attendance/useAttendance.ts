import {useEffect, useState} from "react";
import type { DailyAttendance } from "../../types/types.ts";
import type { Period } from "../../../../../shared/types/types.ts";
import { getStudentAttendance } from "../../api";


export const useAttendance = (studentId: string, period: Period, date:string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [attendance, setAttendance] = useState<DailyAttendance[]>([]);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!studentId || !period || !date) return;

            setLoading(true);
            try {
                const result = await getStudentAttendance(studentId, period, date);
                setAttendance(result);
            } catch (error : any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchAttendance();
    }, [studentId, period, date]);

    return { loading, attendance };
}