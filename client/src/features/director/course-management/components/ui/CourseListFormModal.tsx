import DynamicModalForm, { type FormField } from "../../../../../components/ui/modals/ModalForm.tsx";
import React, { useState } from "react";
import { useAvailableTeachers } from "../../hooks/course-list/useAvailableTeachers.ts";
import { useUpsertCourse } from "../../hooks/course-list/useUpsertCourse.ts";
import type { modeTypes } from "../../../../types/types.ts";
import type { CoursesListData } from "../../types";
import {reverseName} from "../../../../../types";

interface CourseListFormModalProps {
    mode: modeTypes
    teacherId: string | null;
    course: CoursesListData | null;
    onClose: () => void;
    onSuccess: () => void;
}

const FORM_REGEX = {
    name: /^\d{1,4}$/
    /*name: /^(?:\d{1,4}|\d{1,3}[A-Z])$/i,*/
};

export function CourseListFormModal({ mode, teacherId, course, onClose, onSuccess }: CourseListFormModalProps) {
    const isCreateMode = mode === "create";

    const [formData, setFormData] = useState({
        name: course?.course_name || "",
        year: course?.created_at.split('T')[0].split('-')[0] || new Date().getFullYear().toString(),
        teacherId: course?.director_id || "",
    });


    const { teachers } = useAvailableTeachers(teacherId);
    const { upsertCourse, loading, error, setError } = useUpsertCourse(onSuccess)

    const courseFields: FormField[] = [
        { name: "name", label: "Nombre del Curso", type: "text", placeholder: "Ej. 101", required: true },
        { name: "year", label: "Año Lectivo", type: "number", required: true, disabled: true },
        {
            name: "teacherId",
            label: "Director de Grupo (Profesor)",
            type: "select",
            required: true,
            options: teachers.map(t => ({ value: t.id, label: reverseName({
                    middleName: t.teacher_middle_name,
                    secondLastName: t.teacher_second_last_name,
                    firstName: t.teacher_first_name,
                    firstLastName: t.teacher_first_last_name
                })})
            )
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!FORM_REGEX.name.test(formData.name)) {
            setError("El nombre del curso debe ser alfanumerico. Ej 101, 305, 407 etc.");
            return;
        }

        const payload = {
            ...formData,
            name: formData.name.trim().toLowerCase()
        }

        console.log(course);
        await upsertCourse(mode, course?.id || null, payload);
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("")
    }

    return (
        <DynamicModalForm
            isOpen={true}
            title={isCreateMode ? "Crear Nuevo Curso" : "Editar Curso"}
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