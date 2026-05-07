import api from "../../../../api/client.ts";

export const getAttendanceSummary = async (startDate: string, endDate: string) => {
    const response = await api.get(`/attendance/summary?startDate=${startDate}&endDate=${endDate}`);
    return response.data.attendanceSummary;
}