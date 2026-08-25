import { useState } from 'react';
import { deleteCourse } from "../../api";
import toast from "react-hot-toast";

export const useDeleteCourse = (onSuccess: () => void) => {
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

    const deleteCourseById = async (id: string) => {
        setLoadingDelete(true);
        try {
            await deleteCourse(id);
            toast.success("Curso eliminado correctamente.");

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al eliminar el curso";
            console.error(msg);
            toast.error(msg);
        } finally {
            setLoadingDelete(false);
        }
    }

    return { loadingDelete, deleteCourseById };
}