import api from "../../../../api/client.ts";
import type { ClassFinalGrade, DailyAttendance, ParentStudent } from "../types/types.ts";
import type { Period } from "../../../../shared/types/types.ts";

export const getParentStudents = async (): Promise<ParentStudent[]> => {
    const response = await api.get('parents/students');
    return response.data.students
}

export const getStudentGrades = async (studentId: string, periodId: string): Promise<ClassFinalGrade[]> => {
    const response = await api.get(`parents/student/${studentId}/period/${periodId}/grades`);
    return response.data.grades;
}

export const getStudentAttendance = async (studentId: string, period: Period): Promise<DailyAttendance[]> => {
    const response = await api.get(`parents/student/${studentId}/attendance`, {
        params: {
            startDate: period.start_date,
            endDate: period.end_date
        }
    });
    return response.data.attendance;
}