import api from "../../../../api/client.ts";
import type { AssignmentsOverview, ClassDetailsData, Scales } from "../types";

export const getClass = async (id: string): Promise<ClassDetailsData> => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
}
export const saveBulkAttendance = async (id: string, date: string, records: any[]): Promise<void> => {
    return await api.post(`/attendance/class/${id}/bulk`, { date, records });
};

export const getAttendanceClass = async (courseId: string , classId: string, startDate: string, endDate: string) => {
    const response = await api.get(`/attendance/course/${courseId}/class/${classId}?startDate=${startDate}&endDate=${endDate}`);
    return  response.data;
};

export const getDailyAttendance = async (classId: string, date: string) => {
    const response = await api.get(`/attendance/class/${classId}?date=${date}`);
    return response.data;
};

// Assignment Endpoints

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

export const bulkGrades = async (assignmentId: string, payload: any): Promise<void> => {
    return await api.post(`/grades/assignment/${assignmentId}`, payload);
}