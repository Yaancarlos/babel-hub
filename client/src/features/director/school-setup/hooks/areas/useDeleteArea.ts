import {useState} from "react";
import {deleteArea} from "../../api";
import toast from "react-hot-toast";

export const useDeleteArea = (onSuccess: () => void) => {
    const [loadingDelete, setLoadingDelete] = useState(false);

    const deleteAreaById = async (id: string) => {
        if (!id) return;

        setLoadingDelete(true);
        try {
            await deleteArea(id);
            toast.success("Area eliminada correctamente.");

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al eliminar el área."
            console.error(msg);
            toast.error(msg);
        } finally {
            setLoadingDelete(false);
        }
    }

    return { loadingDelete, deleteAreaById }
}