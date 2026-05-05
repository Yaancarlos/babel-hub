import { useState } from 'react';
import type { modeTypes } from "../../types";
import { createClass, updateClass } from "../../api";
import toast from "react-hot-toast";

export const useUpsertClass = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const upsertClass = async (mode: modeTypes, id: string |  undefined, payload: any) => {
        setLoading(true);
        setError("");

        try {
            if (mode === "edit" && id) {
                await updateClass(id, payload);
            } else if (mode === "create") {
                await createClass(payload);
            }
            toast.success(`Clase ${mode === "create" ? "creada" : "editada"} correctamente.`);

            onSuccess();
        } catch (error : any) {
            const msg = error?.response?.data?.message || `Error al ${mode === "create" ? "crear" : "editar"} la clase.`;
            console.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, setError, upsertClass };
}