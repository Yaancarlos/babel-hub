import React, { useState, useEffect } from "react";
import DynamicModalForm, { type FormField } from "../../../../../components/ui/modals/ModalForm.tsx";
import { useStudentSubmit } from "../../hooks/students/useStudentSubmit.ts";
import { getCourses } from "../../api";

interface StudentFormModalProps {
    mode: 'create' | 'edit';
    initialData: any | null;
    onClose: () => void;
    onSuccess: () => void;
}

const formRegExp = [
    { label: "name", regExp: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']{2,50}$/ },
    { label: "email", regExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    { label: "password", regExp: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/ },
];

export function StudentFormModal({ mode, initialData, onClose, onSuccess }: StudentFormModalProps) {
    const [formData, setFormData] = useState({
        fullName: initialData?.full_name || "",
        enrolmentCode: initialData?.enrollment_code || "",
        courseId: initialData?.course_id || "",
        email: "",
        password: ""
    });

    const [availableCourses, setAvailableCourses] = useState<any[]>([]);

    const { submitStudent, loading, error, setError } = useStudentSubmit(onSuccess);

    useEffect(() => {
        const fetchCoursesForDropdown = async () => {
            try {
                const response = await getCourses();
                setAvailableCourses(response);
            } catch (error) {
                console.error("Error GETTING courses for dropdown:", error);
            }
        };
        fetchCoursesForDropdown();
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nameRegExp = formRegExp.find(r => r.label === "name")?.regExp;
        const emailRegExp = formRegExp.find(r => r.label === "email")?.regExp;
        const passwordRegExp = formRegExp.find(r => r.label === "password")?.regExp;

        if (nameRegExp && !nameRegExp.test(formData.fullName)) {
            setError("El nombre debe tener entre 2 y 50 caracteres y solo contener letras.");
            return;
        }

        if (mode === 'create') {
            if (emailRegExp && !emailRegExp.test(formData.email)) {
                setError("Por favor, ingresa un correo electrónico válido.");
                return;
            }
            if (passwordRegExp && !passwordRegExp.test(formData.password)) {
                setError("La contraseña debe tener mínimo 8 caracteres, letras, números y un carácter especial.");
                return;
            }
        }

        const payload = {
            ...formData,
            fullName: formData.fullName.trim().toLowerCase(),
            enrolmentCode: formData.enrolmentCode.trim().toUpperCase()
        };

        await submitStudent(mode, initialData?.student_id || null, payload);
    };

    // @ts-ignore
    const studentFields: FormField[] = [
        { name: "enrolmentCode", label: "Código del estudiante", type: "text", placeholder: "STU-101", required: true },
        { name: "fullName", label: "Nombre", type: "text", placeholder: "Cristian Garcia", required: true },
        { name: "email", label: "Correo electrónico", type: "email", placeholder: "example@gmail.com", required: true },
        { name: "password", label: "Contraseña", type: "password", required: true },
        {
            name: "courseId",
            label: "Curso",
            type: "select",
            required: true,
            options: availableCourses.map(c => ({ value: c.id, label: c.course_name }))
        }
    ].filter(field => mode === 'create' || (field.name !== 'email' && field.name !== 'password'));

    return (
        <DynamicModalForm
            isOpen={true}
            title={mode === 'create' ? "Crear Nuevo Estudiante" : "Editar Estudiante"}
            fields={studentFields}
            formData={formData}
            formError={error}
            formLoading={loading}
            onChange={handleFormChange}
            onSubmit={handleModalSubmit}
            onClose={onClose}
        />
    );
}