import api from "../../../../api/client.ts";
import type {ClassFinalGrade, ParentStudent} from "../types/types.ts";

export const getParentStudents = async (): Promise<ParentStudent[]> => {
    const response = await api.get('parents/students');
    return response.data.students
}

export const getStudentGrades = async (studentId: string): Promise<ClassFinalGrade[]> => {
    const response = await api.get(`parents/student/${studentId}/grades`);
    return response.data.grades;
}