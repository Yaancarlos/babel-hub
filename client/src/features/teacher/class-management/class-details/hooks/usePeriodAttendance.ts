import { useState, useEffect } from "react";
import { getPeriodAttendance } from "../api";
import toast from "react-hot-toast";

interface PeriodAttendanceProps {
    courseId: string,
    classId: string,
    startDate: string,
    endDate: string
}

export const usePeriodAttendance = ({ courseId, classId, startDate, endDate }: PeriodAttendanceProps) => {
    const [loading, setLoading] = useState(false);
    const [periodAttendance, setPeriodAttendance] = useState<any[]>([]);
    const [calendarDates, setCalendarDates] = useState<string[]>([]);

    useEffect(() => {
        const loadPeriodAttendance = async () => {
            if (!courseId || !classId || !startDate || !endDate) return;

            const today = new Date();
            const periodStart = new Date(startDate);

            if (today < periodStart) {
                setPeriodAttendance([]);
                setCalendarDates([]);
                return;
            }

            const todayStr = today.toISOString().split('T')[0];
            const periodEndStr = endDate.split('T')[0];
            const effectiveEndDate = todayStr < periodEndStr ? todayStr : periodEndStr;

            setLoading(true);
            try {
                const attendance = await getPeriodAttendance(courseId, classId, startDate, effectiveEndDate);

                const dates = new Set<string>();
                const student = new Map();

                attendance.forEach((row: any) => {
                    dates.add(row.date);

                    if (!student.has(row.student_id)) {
                        student.set(row.student_id, {
                            student_id: row.student_id,
                            name: row.name,
                            records: []
                        })
                    }

                    student.get(row.student_id).records.push({ date: row.date, status: row.status });
                })

                setCalendarDates(Array.from(dates).sort());
                setPeriodAttendance(Array.from(student.values()));
            } catch (error : any) {
                console.error("Error GETTING the caledar ", error);
                toast.error("Error al cargar el calendario");
            } finally {
                setLoading(false);
            }
        }
        loadPeriodAttendance();
    }, [courseId, classId, startDate, endDate]);

    return { loading, periodAttendance, calendarDates };
}