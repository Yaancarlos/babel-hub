import { useState } from "react";
import { deleteParent } from "../../api";
import toast from "react-hot-toast";

export const useParentDelete = (onSuccess: () => void) => {
    const [loadingDelete, setLoadingDelete] = useState(false);

    const deleteParentById = async (parentId: string) => {
        setLoadingDelete(true);
        try {
            await deleteParent(parentId);
            toast.success("Acudiente eliminado correctamente");

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al eliminar el acudiente."
            console.error(msg)
            toast.error(msg);
        } finally {
            setLoadingDelete(false);
        }
    }

    return { deleteParentById, loadingDelete };
}