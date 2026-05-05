import { useState } from "react";
import type { modeTypes } from "../../types";
import { createPeriod, updatePeriod } from "../../api";
import toast from "react-hot-toast";

export const useUpsertPeriod = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const upsertPeriod = async (mode: modeTypes, periodId: string | undefined, payload: any) => {
        setLoading(true);
        setError("");

        try {
            if (mode === 'edit' && periodId) {
                await updatePeriod(periodId, payload);
            } else if (mode === 'create') {
                await createPeriod(payload);
            }
            toast.success(`Periodo ${mode === "create" ? "creado" : "editado"} correctamente.`);

            onSuccess();
        } catch (error : any) {
            const msg = error?.response?.data?.message || `Error al ${mode === "create" ? "crear" : "editar"} el periodo.`;
            console.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return { upsertPeriod, loading, error, setError };
}