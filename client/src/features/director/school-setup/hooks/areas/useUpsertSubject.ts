import { useState } from "react";
import type { modeTypes } from "../../../types/types.ts";
import { createSubject, updateSubject } from "../../api";
import toast from "react-hot-toast";

export const useUpsertSubject = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const upsertSubject = async (mode: modeTypes, subjectId: string | undefined, payload: any) => {
        setLoading(true);
        try {
            if (mode === 'edit' && subjectId) {
                await updateSubject(subjectId, payload);
            } else if (mode === 'create') {
                await createSubject(payload);
            }
            toast.success(`Asignatura ${mode === 'create' ? 'creada' : 'editada'} correctamente`);

            onSuccess();
        } catch (error : any) {
            console.error(error);
            setError(error.response?.data?.message || "Error al guardar la materia.");
        } finally {
            setLoading(false);
        }
    };

    return { upsertSubject, loading, error, setError };
}