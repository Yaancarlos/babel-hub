import api from "../../../../api/client.ts";

// Area Endpoints

export const createArea = async (payload: any) => {
    await api.post("/areas", payload)
}

export const updateArea = async (id: string, payload: any) => {
    await api.put(`/areas/${id}`, payload);
}

export const deleteArea = async (id: string) => {
    await api.delete(`/areas/${id}`);
}

export const getAreaById = async (id: string) => {
    const response = await api.get(`/areas/${id}`);
    return response.data.area;
}

export const getSubjects = async (id: string) => {
    const response = await api.get(`/subjects/area/${id}`);
    return response.data.subjects;
}

export const createSubject = async (payload: any) => {
    await api.post("/subjects", payload);
}

export const updateSubject = async (id: string, payload: any) => {
    await api.put(`/subjects/${id}`, payload);
}

export const deleteSubject = async (id: string) => {
    await api.delete(`/subjects/${id}`);
}

// Periods Endpoints

export const createPeriod = async (payload: any) => {
    await api.post("/periods", payload);
}

export const updatePeriod = async (id: string, payload: any) => {
    await api.put(`/periods/${id}`, payload);
}

export const deletePeriod = async (id: string) => {
    await api.delete(`/periods/${id}`);
}
