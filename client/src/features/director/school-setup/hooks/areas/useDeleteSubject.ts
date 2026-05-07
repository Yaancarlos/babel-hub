import { useState } from "react";
import toast from "react-hot-toast";
import { deleteSubject } from "../../api";

export const useDeleteSubject = (onSuccess: () => void) => {
    const [loadingDelete, setLoadingDelete] = useState(false);

    const deleteSubjectById = async (id: string) => {
        if (!id) return;

        setLoadingDelete(true);
        try {
            await deleteSubject(id);
            toast.success("Asignatura eliminada");

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al eliminar la asignatura";
            console.error(msg);
            toast.error(msg);
        } finally {
            setLoadingDelete(false);
        }
    }

    return { loadingDelete, deleteSubjectById };
}