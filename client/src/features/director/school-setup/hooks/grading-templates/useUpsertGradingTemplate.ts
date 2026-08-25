import { useState } from "react";
import type { modeTypes } from "../../../../types/types.ts";
import { createGradingTemplate, updateGradingTemplate } from "../../api";
import toast from "react-hot-toast";

export const useUpsertGradingTemplate = (onSuccess: () => void) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const upsertGradingTemplate = async (mode: modeTypes, id: string | null, payload: any) => {
        setLoading(true);
        setError("");

        try {
            if (mode === "create") {
                await createGradingTemplate(payload);
            } else if (mode === "edit" && id) {
                await updateGradingTemplate(id, payload);
            } else {
                throw new Error("No se pudo determinar la acción a realizar");
            }

            toast.success(`Template ${mode === "create" ? "creada" : "editada"} correctamente.`);
            onSuccess();
        } catch (error : any) {
            const msg = error?.response?.data?.message || error?.message || `Error al ${mode === "create" ? "crear" : "editar"} el template.`;
            console.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return { loading, upsertGradingTemplate, error, setError };
}