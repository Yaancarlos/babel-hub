import { useState } from "react";
import { linkStudentToParent } from "../../api";
import toast from "react-hot-toast";

export const useAssignStudentSubmit = (onSuccess: () => void) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const assignStudent = async (payload: { parentId: string, studentId: string, relationshipType: string }) => {
        setLoading(true);
        setError("");

        try {
            await linkStudentToParent(payload);
            toast.success("Estudiante vinculado correctamente");

            onSuccess();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Error al vincular el estudiante.";
            console.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, assignStudent, setError };
};