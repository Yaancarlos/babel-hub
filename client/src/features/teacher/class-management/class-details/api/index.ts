import api from "../../../../../api/client.ts";

export const getTeacherClass = async (id: string, controller: any) => {
    const response = await api.get(`/classes/teacher/class/${id}`, { signal: controller.signal });
    return response.data.teacherClass;
}

export const getDailyAttendance = async (id: string, date:string) => {
    const response = await api.get(`/attendance/class/${id}?date=${date}`);
    return response.data.records;
}

export const getPeriodAttendance = async (courseId: string, classId: string, startDate:string, endDate: string) => {
    const response = await api.get(`/attendance/course/${courseId}/class/${classId}?startDate=${startDate}&endDate=${endDate}`);
    return response.data.attendanceClass;

}

export const bulkAttendance = async (id: string, date:string, records:any[]) => {
    await api.post(`/attendance/class/${id}/bulk`, { date, records });
}