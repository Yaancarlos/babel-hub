import { useState } from 'react';
import { createCourse, updateCourse } from "../../api";
import toast from "react-hot-toast";
import type { modeTypes } from "../../../../types/types.ts";

export const useUpsertCourse = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const upsertCourse = async (mode: modeTypes, courseId: string, payload: any) => {
        setLoading(true);
        setError("");

        try {
            if (mode === "edit" && courseId) {
                await updateCourse(courseId, payload);
            } else if (mode === "create") {
                await createCourse(payload);
            }
            toast.success(`Curso ${mode === "create" ? "creado" : "editado"} correctamente`);

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al crear el curso.";
            console.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return { upsertCourse, loading, error, setError };
}