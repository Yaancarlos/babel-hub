import { useState } from "react";
import toast from "react-hot-toast";
import { deleteGradingTemplate } from "../../api";

export const useDeleteGradingTemplate = (onSuccess: () => void) => {
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

    const deleteGradingTemplateById = async (id: string) => {
        if (!id) return;

        setLoadingDelete(true);
        try {
            await deleteGradingTemplate(id);
            toast.success("Template eliminado correctamente");

            onSuccess();
        } catch (error : any) {
            const msg = error?.response?.data?.message || "Error al eliminar el template";
            console.error(msg);
            toast.error(msg);
        } finally {
            setLoadingDelete(false);
        }
    }

    return { loadingDelete, deleteGradingTemplateById };
}