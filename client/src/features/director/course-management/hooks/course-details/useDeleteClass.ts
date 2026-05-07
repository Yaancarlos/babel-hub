import { useState } from "react";
import toast from "react-hot-toast";
import { deleteCLass } from "../../api";

export const useDeleteClass = (onSuccess: () => void) => {
    const [loadingDelete, setLoadingDelete] = useState(false);

    const deleteClassById = async (id: string) => {
        if (!id) return;

        setLoadingDelete(true);
        try {
            await deleteCLass(id);
            toast.success("Clase eliminada correctamente");

            onSuccess();
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Error al eliminar la clase.";
            console.error(msg);
            toast.error(msg);
        } finally {
            setLoadingDelete(false);
        }
    }

    return { loadingDelete, deleteClassById };
}