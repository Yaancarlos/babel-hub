import DynamicModalForm, { type FormField } from "../../../../../components/ui/modals/ModalForm.tsx";
import type { modeTypes } from "../../../../types/types.ts";
import React, {  useState  } from "react";
import { useUpsertSubject } from "../../hooks/areas/useUpsertSubject.ts";
import type { SubjectsProps } from "../../types";
import type {AvailableSubjects} from "../../../course-management/types";

interface AreaDetailsFormModalProps {
    mode: modeTypes;
    onSuccess: () => void;
    subject: SubjectsProps | null;
    onClose: () => void;
    areaId: string;
}

export function AreaDetailsFormModal({ mode, onSuccess, subject, onClose, areaId }: AreaDetailsFormModalProps) {
    const isCreateMode = mode === "create";
    const [formData, setFormData] = useState({
        name: subject?.name  || "",
        gradingTemplateId: subject?.grading_template_id || ""
    });

    const subjectFormItems: FormField[] = [
        { name: "name", label: "Nombre de la Materia", type: "text", placeholder: "Ej. Biología", required: true },
        {
            name: "gradingTemplateId",
            label: "Tipo de Nota",
            type: "select",
            required: true,
            options: subjects.map((s: AvailableSubjects) => ({ value: s.id, label: s.name }))
        }
    ];

    const { loading, error, setError, upsertSubject } = useUpsertSubject(onSuccess);

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Rellena los campos');
            return;
        }

        const payload = { name: formData.name.trim().toLowerCase(), areaId: areaId };

        await upsertSubject(mode, subject?.id || null, payload);
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    }

    return (
        <DynamicModalForm
            isOpen={true}
            title={isCreateMode ? `Añadir asignatura` : `Editar asignatura`}
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