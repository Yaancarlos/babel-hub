import { useState } from "react";
import type { modeTypes } from "../../../../types/types.ts";
import { createAssessmentCriteria, updateAssessmentCriteria } from "../../api";
import toast from "react-hot-toast";

export const useUpsertAssessment = (onSuccess: () => void) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const upsertAssessment = async (mode: modeTypes, id: string | null, payload: any) => {
        setLoading(true);
        setError("");

        try {
            if (mode === "create") {
                await createAssessmentCriteria(payload);
            } else if (mode === "edit" && id) {
                await updateAssessmentCriteria(id, payload);
            } else {
                throw new Error("No se pudo determinar la acción a realizar (falta el ID para editar)");
            }

            toast.success(`Criterio de evaluacion ${mode === "create" ? "creado" : "editado"} correctamente.`);
            onSuccess();
        } catch (error : any) {
            const msg = error?.response?.data?.message || error?.message || `Error al ${mode === "create" ? "crear" : "editar"} el criterio.`;
            console.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return { loading, upsertAssessment, error, setError };
}