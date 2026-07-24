import DynamicModalForm, { type FormField } from "../../../../../components/ui/modals/ModalForm.tsx";
import type { modeTypes } from "../../../../types/types.ts";
import React, {  useState  } from "react";
import { useUpsertSubject } from "../../hooks/areas/useUpsertSubject.ts";
import type { SubjectsProps } from "../../types";

interface AreaDetailsFormModalProps {
    mode: modeTypes;
    onSuccess: () => void;
    subject: SubjectsProps | undefined;
    onClose: () => void;
    areaId: string;
}

const subjectFormItems: FormField[] = [
    { name: "name", label: "Nombre de la Materia", type: "text", placeholder: "Ej. Biología", required: true }
];

export function AreaDetailsFormModal({ mode, onSuccess, subject, onClose, areaId }: AreaDetailsFormModalProps) {
    const [formData, setFormData] = useState({
        name: subject?.name  || ""
    });

    const { loading, error, setError, upsertSubject } = useUpsertSubject(onSuccess);

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Rellena los campos');
            return;
        }

        const payload = { name: formData.name.trim().toLowerCase(), areaId: areaId };

        await upsertSubject(mode, subject?.id, payload);
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    }

    return (
        <DynamicModalForm
            isOpen={true}
            title={mode === 'create' ? `Añadir asignatura` : `Editar asignatura`}
            fields={subjectFormItems}
            formData={formData}
            formError={error}
            formLoading={loading}
            onClose={onClose}
            onChange={handleOnChange}
            onSubmit={handleUpsert}
        />
    )
}