import { useState } from "react";
import { deleteStudent } from "../../api";
import toast from "react-hot-toast";

export const useStudentDelete = (onSuccess: () => void) => {
    const [loadingDelete, setLoadingDelete] = useState(false);

    const deleteStudentById = async (studentId: string) => {
        setLoadingDelete(true);
        try {
            await deleteStudent(studentId);
            toast.success("Estudiante eliminado correctamente");

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al eliminar el estudiante."
            console.error(msg)
            toast.error(msg);
        } finally {
            setLoadingDelete(false);
        }
    }

    return { deleteStudentById, loadingDelete };
}