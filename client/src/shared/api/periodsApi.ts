import api from "../../api/client.ts";
import type { Period } from "../types/period.ts";

export const getPeriods = async (): Promise<Period[]> => {
    const response = await api.get('/periods');
    return response.data.periods;
};