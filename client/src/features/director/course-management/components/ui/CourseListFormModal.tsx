import DynamicModalForm, { type FormField } from "../../../../../components/ui/modals/ModalForm.tsx";
import React, { useState } from "react";
import { useAvailableTeachers } from "../../hooks/course-list/useAvailableTeachers.ts";
import { useUpsertCourse } from "../../hooks/course-list/useUpsertCourse.ts";
import type { modeTypes } from "../../../types/types.ts";

interface CourseListFormModalProps {
    mode: modeTypes
    teacherId: string | null;
    course: any;
    onClose: () => void;
    onSuccess: () => void;
}

const formRegExp = [
    { label: "name", regExp: /^(?:\d{1,4}|\d{1,3}[A-Z])$/i },
];

export function CourseListFormModal({ mode, teacherId, course, onClose, onSuccess }: CourseListFormModalProps) {
    const [formData, setFormData] = useState({
        name: course?.course_name || "",
        year: course?.created_at.split('T')[0].split('-')[0] || new Date().getFullYear().toString(),
        teacherId: course?.director_id || "",
    });

    const { teachers } = useAvailableTeachers(teacherId);
    const { upsertCourse, loading, error, setError } = useUpsertCourse(onSuccess)

    const courseFields: FormField[] = [
        { name: "name", label: "Nombre del Curso", type: "text", placeholder: "Ej. 10-A", required: true },
        { name: "year", label: "Año Lectivo", type: "number", required: true, disabled: true },
        {
            name: "teacherId",
            label: "Director de Grupo (Profesor)",
            type: "select",
            required: true,
            options: teachers.map(t => ({ value: t.id, label: t.full_name }))
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nameRegExp = formRegExp.find(r => r.label === "name")?.regExp;

        if (nameRegExp && !nameRegExp.test(formData.name)) {
            setError("El nombre del curso debe ser alfanumerico. Ej 10A, 305, 407, 11B etc.");
            return;
        }

        const payload = {
            ...formData,
            name: formData.name.trim().toLowerCase()
        }

        await upsertCourse(mode, course?.id, payload);
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("")
    }

    return (
        <DynamicModalForm
            isOpen={true}
            title={mode === 'create' ? "Crear Nuevo Curso" : "Editar Curso"}
            fields={courseFields}
            formData={formData}
            formError={error}
            formLoading={loading}
            onClose={onClose}
            onChange={handleOnChange}
            onSubmit={handleSubmit}
        />
    )
}