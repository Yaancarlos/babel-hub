import { useState } from "react";
import { uploadStudent, createStudent } from "../../api";
import toast from "react-hot-toast";
import type { modeTypes } from "../../types";

export const useStudentSubmit = (onSuccess: () => void) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const submitStudent = async (mode: modeTypes, studentId: string, payload: any) => {
        setLoading(true);
        setError("");

        try {
            if (mode === "edit" && studentId) {
                await uploadStudent(studentId, payload);
            } else if (mode === "create") {
                await createStudent(payload);
            }
            toast.success(`Estudiante ${mode === 'create' ? 'creado' : 'editado'} correctamente`)

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al guardar el estudiante."
            console.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, submitStudent, setError };
}