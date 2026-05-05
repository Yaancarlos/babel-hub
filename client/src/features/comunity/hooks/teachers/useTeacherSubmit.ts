import { useState } from 'react';
import type { modeTypes } from "../../types";
import { createTeacher, updateTeacher} from "../../api";
import toast from "react-hot-toast";

export const useTeacherSubmit = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const teacherSubmit = async (mode: modeTypes, teacherId: string, payload: any) => {
        setLoading(true);
        try {
            if (mode === "edit" && teacherId) {
                await updateTeacher(teacherId, payload);
            } else if (mode === "create") {
                await createTeacher(payload);
            }
            toast.success(`Profesor ${mode === 'create' ? 'creado' : 'editado'} correctamente`)

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al guardar el profesor."
            console.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return { teacherSubmit, error, setError, loading };
}