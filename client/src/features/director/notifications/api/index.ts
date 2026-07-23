import api from "../../../../api/client.ts";

export const getAttendanceSummary = async (startDate: string, endDate: string) => {
    const response = await api.get(`/attendance/summary?startDate=${startDate}&endDate=${endDate}`);
    return response.data.attendanceSummary;
}

export const getAttendanceStudentCalendar = async (startDate: string, endDate: string, studentId: string, controller: any) => {
    const response = await api.get(`/attendance/summary/calendar?startDate=${startDate}&endDate=${endDate}&studentId=${studentId}`, { signal: controller.signal });
    return response.data.attendanceByCalendar;
}