import api from "../../../../../api/client.ts";

export const getCLasses = async () => {
    const response = await api.get("/classes/teacher/classes");
    return response.data.teacherClasses;
}

export const getCourse = async () => {
    const response = await api.get("/courses/teacher/course");
    return response.data.teacherCourse;
}