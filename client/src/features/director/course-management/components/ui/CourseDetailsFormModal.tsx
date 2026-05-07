import DynamicModalForm, { type FormField } from "../../../../../components/ui/modals/ModalForm.tsx";
import type { ClassItem } from "../../types";
import React, { useState } from "react";
import { useUpsertClass } from "../../hooks/course-details/useUpsertClass.ts";
import { useModalData } from "../../hooks/course-details/useModalData.ts";
import type { modeTypes } from "../../../types/types.ts";

interface CourseDetailsFormProps {
    id: string;
    courseName: string | undefined;
    mode: modeTypes;
    classToEdit: ClassItem | null;
    onSuccess: () => void;
    onClose: () => void;
}

export const CourseDetailsFormModal = ({ id, courseName, mode, classToEdit, onSuccess, onClose }: CourseDetailsFormProps) => {
    const { teachers, subjects } = useModalData(id);
    const { loading, error, setError, upsertClass } = useUpsertClass(onSuccess);

    const [formData, setFormData] = useState({
        courseId: id || "",
        subjectId: "",
        teacherId: ""
    });

    //@ts-ignore
    const assignClassFields: FormField[] = [
        {
            name: "courseId",
            label: "Curso",
            type: "text",
            disabled: true,
        },
        {
            name: "subjectId",
            label: "Materia",
            type: "select",
            required: true,
            options: subjects.map((s: any) => ({ value: s.id, label: s.name }))
        },
        {
            name: "teacherId",
            label: "Profesor",
            type: "select",
            required: true,
            options: teachers.map((t: any) => ({ value: t.id, label: t.full_name }))
        }
    ].filter(field => mode === "create" || (field.name !== 'courseId' && field.name !== 'subjectId'));

    const handleUpsertClass = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { newTeacher: formData.teacherId }
        await upsertClass(mode, classToEdit?.class_id, mode === 'create' ? formData : payload);
    }

    const handleFormChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setError("")
    }

    return (
        <DynamicModalForm
            isOpen={true}
            title={mode === 'create' ? "Crear Nueva Clase" : "Editar Profesor de Clase"}
            fields={assignClassFields}
            formData={{...formData, courseId: courseName || formData.courseId }}
            formError={error}
            formLoading={loading}
            onChange={handleFormChange}
            onSubmit={handleUpsertClass}
            onClose={onClose}
        />
    )
}