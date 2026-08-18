import { useState, useEffect } from "react";
import type { Scales } from "../types";
import { getClassScale } from "../api";

export const useClassScale = (classId: string) => {
    const [scale, setScale] = useState<Scales | null>(null);
    const [loadingScale, setLoadingScale] = useState<boolean>(false);

    useEffect(() => {
        const fetchScales = async () => {
            if (!classId) return;

            setLoadingScale(true);
            try {
                const record = await getClassScale(classId);
                setScale(record);
            } catch (error : any) {
                const msg = error.message || "Error al cargar las escalas de la asignatura";
                console.error(msg);
            } finally {
                setLoadingScale(false);
            }
        }
        fetchScales();
    }, [classId]);

    return { loadingScale, scale }
}