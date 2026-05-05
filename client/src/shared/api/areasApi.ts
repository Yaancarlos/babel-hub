import api from "../../api/client.ts";
import type { Area } from "../types/areas.ts";

export const getAreas = async (): Promise<Area[]> => {
    const response = await api.get("/areas");
    return response.data.areas;
}