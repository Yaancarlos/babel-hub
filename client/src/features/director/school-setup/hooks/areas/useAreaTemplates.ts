import { useState, useEffect } from "react";
import type { GradingTemplate } from "../../types";
import toast from "react-hot-toast";
import { getGradingTemplates } from "../../api";

export const useAreaTemplates = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [gradingTemplates, setGradingTemplates] = useState<GradingTemplate[]>([]);

    useEffect(() => {
        const fetchGradingTemplates = async () => {
            setLoading(true);
            try {
                const records = await getGradingTemplates();
                setGradingTemplates(records);
            } catch (error : any) {
                const msg = error?.response?.data?.message || "Error al cargar las escalas";
                console.error(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        }
        fetchGradingTemplates();
    }, []);

    return { loading, gradingTemplates };
}