import { useState, useEffect } from "react";
import {getAttendanceClass} from "../api";
import toast from "react-hot-toast";
import type { AttendanceStatus } from "../../../types/types";

interface AttendanceGridProps {
    courseId: string,
    classId: string,
    startDate: string,
    endDate: string
}

export interface CourseAttendance {
    student_id: string;
    student_first_name: string;
    student_middle_name: string | null;
    student_first_last_name: string;
    student_second_last_name: string | null;
    date: string;
    status: AttendanceStatus;
}

export const useAttendanceGrid = ({ courseId, classId, startDate, endDate }: AttendanceGridProps) => {
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [calendar, setCalendar] = useState<string[]>([]);

    useEffect(() => {
        if (!startDate || !endDate) return;

        const showAttendance = async () => {
            const today = new Date();
            const periodStart = new Date(startDate);

            if (today < periodStart) {
                setAttendance([]);
                setCalendar([]);
                return;
            }
            const todayStr = today.toISOString().split('T')[0];
            const periodEndStr = endDate.split('T')[0];
            const effectiveEndDate = todayStr < periodEndStr ? todayStr : periodEndStr;

            setLoading(true);
            try {
                const response = await getAttendanceClass(courseId, classId, startDate, effectiveEndDate);
                const data = response.attendanceClass;

                const datesSet = new Set<string>();
                const studentMap = new Map();

                data.forEach((row: CourseAttendance) => {
                    datesSet.add(row.date);

                    if (!studentMap.has(row.student_id)) {
                        studentMap.set(row.student_id, {
                            student_id: row.student_id,
                            firstName: row.student_first_name,
                            middleName: row.student_middle_name,
                            firstLastName: row.student_first_last_name,
                            secondLastName: row.student_second_last_name,
                            records: []
                        });
                    }
                    studentMap.get(row.student_id).records.push({ date: row.date, status: row.status });
                });

                setCalendar(Array.from(datesSet).sort());
                setAttendance(Array.from(studentMap.values()));
            } catch (error) {
                console.error("Error GETTING the caledar ", error);
                toast.error("Error al cargar el calendario");
            } finally {
                setLoading(false);
            }
        }
        showAttendance();
    }, [courseId, classId, startDate, endDate]);

    return {
        loading,
        calendar,
        attendance,
    }
}