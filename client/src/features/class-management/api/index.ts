import api from "../../../api/client.ts";

export const getClass = async (id: string) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
}
export const saveBulkAttendance = async (id: string, date: string, records: any[]) => {
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