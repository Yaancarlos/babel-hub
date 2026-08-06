import DynamicModalForm, { type FormField } from "../../../../../components/ui/modals/ModalForm.tsx";
import type { modeTypes } from "../../../../types/types.ts";
import React, {  useState  } from "react";
import { useUpsertSubject } from "../../hooks/subjects/useUpsertSubject.ts";
import type { GradingTemplate, SubjectsProps } from "../../types";
import { useAreaTemplates } from "../../hooks/areas/useAreaTemplates.ts";

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

    const { loading, error, setError, upsertSubject } = useUpsertSubject(onSuccess);
    const { gradingTemplates } = useAreaTemplates();

    const subjectFormItems: FormField[] = [
        { name: "name", label: "Nombre de la Asignatura", type: "text", placeholder: "Ej. Biología", required: true },
        {
            name: "gradingTemplateId",
            label: "Template",
            type: "select",
            required: true,
            options: gradingTemplates.map((s: GradingTemplate) => ({ value: s.id, label: s.name }))
        }
    ];


    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim() || !formData.gradingTemplateId) {
            setError("Ingresa los campos obligatorios");
            return;
        }

        const payload = {
            name: formData.name.trim().toLowerCase(),
            areaId: areaId,
            gradingTemplateId: formData.gradingTemplateId
        };

        await upsertSubject(mode, subject ? subject.id : null, payload);
    }

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            onChange={handleFormChange}
            onSubmit={handleUpsert}
        />
    )
}