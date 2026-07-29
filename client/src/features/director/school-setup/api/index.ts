import api from "../../../../api/client.ts";
import type {AreaProps, SubjectsProps} from "../types";

// Area Endpoints

export const createArea = async (payload: any): Promise<void> => {
    await api.post("/areas", payload)
}

export const updateArea = async (id: string, payload: any): Promise<void> => {
    await api.put(`/areas/${id}`, payload);
}

export const deleteArea = async (id: string): Promise<void> => {
    await api.delete(`/areas/${id}`);
}

export const getAreaById = async (id: string): Promise<AreaProps> => {
    const response = await api.get(`/areas/${id}`);
    return response.data.area;
}

export const getSubjects = async (id: string): Promise<SubjectsProps[]> => {
    const response = await api.get(`/subjects/area/${id}`);
    return response.data.subjects;
}

export const createSubject = async (payload: any): Promise<void> => {
    await api.post("/subjects", payload);
}

export const updateSubject = async (id: string, payload: any): Promise<void> => {
    await api.put(`/subjects/${id}`, payload);
}

export const deleteSubject = async (id: string): Promise<void> => {
    await api.delete(`/subjects/${id}`);
}

// Periods Endpoints

export const createPeriod = async (payload: any): Promise<void> => {
    await api.post("/periods", payload);
}

export const updatePeriod = async (id: string, payload: any): Promise<void> => {
    await api.put(`/periods/${id}`, payload);
}

export const deletePeriod = async (id: string): Promise<void> => {
    await api.delete(`/periods/${id}`);
}
