import { useState } from "react";
import { deleteTeacher } from "../../api";
import toast from "react-hot-toast";

export const useDeleteTeacher = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);

    const deleteTeacherById = async (id: string) => {
        setLoading(true);
        try {
            await deleteTeacher(id);
            toast.success("Profesor eliminado correctamente");

            onSuccess();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Error al eliminar el profesor";
            console.error(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    return { deleteTeacherById, loading }
}