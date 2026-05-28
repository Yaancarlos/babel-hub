import api from "../../../../api/client.ts";
import type { CreateStudent, CreateTeacher, UpdateTeacher, UpdateStudent } from "../types";

//Students Endpoints

export const getStudents = async () => {
    const response = await api.get("/student");
    return response.data.students;
}

export const getStudentById = async (id: string) => {
    const response = await api.get(`/student/${id}`);
    return response.data.record;
}

export const getCourses = async () => {
    const response = await api.get('/courses');
    return response.data.courses;
}

export const createStudent = async (payload: CreateStudent) => {
    await api.post("/student", payload);
}

export const uploadStudent = async (studentId: string, payload: UpdateStudent) => {
    await api.put(`/student/${studentId}`, payload);
}

export const deleteStudent = async (id: string) => {
    await api.delete(`/student/${id}`);
}

//Teachers Endpoint

export const getTeachers = async () => {
    const response = await api.get("/teacher");
    return response.data.teachers;
}

export const getTeacherById = async (id: string) => {
    const response = await api.get(`/teacher/${id}`);
    return response.data;
}

export const createTeacher = async (payload: CreateTeacher) => {
    await api.post("/teacher", payload);
}

export const updateTeacher = async (id: string, payload: UpdateTeacher) => {
    await api.put(`/teacher/${id}`, payload);
}

export const deleteTeacher = async (id: string) => {
    await api.delete(`/teacher/${id}`);
}