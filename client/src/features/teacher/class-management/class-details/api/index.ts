import api from "../../../../../api/client.ts";
import type { ClassAttendance, ClassDetailsData, CourseAttendance } from "../types";
import type { AssignmentsOverview, Scales } from "../../../../../types";

export const getTeacherClass = async (id: string, controller: any): Promise<ClassDetailsData> => {
    const response = await api.get(`/classes/teacher/class/${id}`, { signal: controller.signal });
    return response.data.teacherClass;
}

export const getDailyAttendance = async (id: string, date:string): Promise<ClassAttendance[]> => {
    const response = await api.get(`/attendance/class/${id}?date=${date}`);
    return response.data.records;
}

export const getPeriodAttendance = async (courseId: string, classId: string, startDate:string, endDate: string): Promise<CourseAttendance[]> => {
    const response = await api.get(`/attendance/course/${courseId}/class/${classId}?startDate=${startDate}&endDate=${endDate}`);
    return response.data.attendanceClass;

}

export const bulkAttendance = async (id: string, date:string, records:any[]) => {
    await api.post(`/attendance/class/${id}/bulk`, { date, records });
}

// Assignment Endpoint

export const getAssignmentOverview = async (courseId: string, classId: string): Promise<AssignmentsOverview> => {
    const response = await api.get(`/assignments/${courseId}/class/${classId}/overview`);
    return response.data.assignments;
}

export const createAssignment = async (payload: any): Promise<void> => {
    return await api.post(`/assignments`, payload);
}

export const updateAssignment = async (assignmentId: string, payload: any): Promise<void> => {
    return await api.patch(`/assignments/${assignmentId}`, payload);
}

export const deleteAssignment = async (assignmentId: string): Promise<void> => {
    return await api.delete(`/assignments/${assignmentId}`);
}

// Grade Endpoint

export const getClassScale = async (classId: string): Promise<Scales> => {
    const records = await api.get(`/scales/class/${classId}`);
    return records.data.scale;
}

export const bulkGrades = async (classId: string, assignmentId: string, payload: any): Promise<void> => {
    return await api.post(`/grades/class/${classId}/assignment/${assignmentId}`, {
        records: payload
    });
}