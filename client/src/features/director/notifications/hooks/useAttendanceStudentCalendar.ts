import { useState, useEffect } from "react";
import {getAttendanceStudentCalendar} from "../api";
import axios from "axios";

interface AttendanceByCalendar {
    date: string;
    daily_status: string;
}

interface AttendanceStudentCalendarProps {
    startDate: string;
    endDate: string;
    studentId: string;
}

export const useAttendanceStudentCalendar = ({ startDate, endDate, studentId }: AttendanceStudentCalendarProps) => {
    const [attendance, setAttendance] = useState<AttendanceByCalendar[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!studentId || !startDate || !endDate) return;

        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAttendanceStudentCalendar(startDate, endDate, studentId, controller);
                setAttendance(data);
                setLoading(false);
            } catch (error: any) {
                if (axios.isCancel(error) || (error as Error).name === 'AbortError') return;

                console.error(error);
                setError(error.response?.data?.message || error.message || "Error al cargar...");

                setLoading(false);
            }
        }
        fetchData();

        return () => controller.abort();
    }, [startDate, endDate, studentId]);

    return { attendance, loading, error };
}