import { useState } from "react";
import { deletePeriod } from "../../api";
import toast from "react-hot-toast";

export const useDeletePeriod = (onSuccess: () => void) => {
    const [loadingDelete, setLoadingDelete] = useState(false);

    const deletePeriodById = async (id: string) => {
        if (!id) return;

        setLoadingDelete(true);
        try {
            await deletePeriod(id);
            toast.success("Periodo eliminado correctamente.");

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al eliminar el periodo."
            console.error(msg);
            toast.error(msg);
        } finally {
            setLoadingDelete(false);
        }
    }

    return { loadingDelete, deletePeriodById };
}