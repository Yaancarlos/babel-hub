import { useState, useEffect } from "react";
import type { Scale } from "../../types";
import toast from "react-hot-toast";
import { getScales } from "../../api";

export const useGradingTemplateModalData = () => {
    const [scales, setScales] = useState<Scale[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchScales = async () => {
            setLoading(true);
            try {
                const scales = await getScales();
                setScales(scales);
            } catch (error : any) {
                const msg = error?.response?.data?.message || "Error al cargar las escalas";
                console.error(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        }
        fetchScales();
    }, [])

    return { scales, loading };
}