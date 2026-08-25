import { useState } from "react";
import { deleteAssessmentCriteria } from "../../api";
import toast from "react-hot-toast";

export const useDeleteAssessment = (onSuccess: () => void) => {
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

    const deleteAssessmentById = async (id: string) => {
        if (!id) return;

        setLoadingDelete(true);
        try {
            await deleteAssessmentCriteria(id);
            toast.success("Evaluacion de criterio eliminada correctamente");

            onSuccess();
        } catch (error : any) {
            const msg = error?.response?.data?.message || "Error al eliminar la Evaluacion de Criterio";
            console.error(msg);
            toast.error(msg);
        } finally {
            setLoadingDelete(false);
        }
    }

    return { loadingDelete, deleteAssessmentById };
}