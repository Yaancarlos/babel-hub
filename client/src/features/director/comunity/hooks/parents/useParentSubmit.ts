import { useState } from "react";
import { createParent } from "../../api";
import toast from "react-hot-toast";
import type { modeTypes } from "../../../../types/types.ts";

export const useParentSubmit = (onSuccess: () => void) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const submitParent = async (mode: modeTypes, parentId: string | null, payload: any) => {        setLoading(true);
        setError("");

        try {
            if (mode === "edit" && parentId) {
                //
            } else if (mode === "create") {
                await createParent(payload);
            }
            toast.success(`Acudiente ${mode === 'create' ? 'creado' : 'editado'} correctamente`)

            onSuccess();
        } catch (error : any) {
            const msg = error.response?.data?.message || "Error al guardar el acudiente."
            console.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, submitParent, setError };
}