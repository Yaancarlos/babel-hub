import DynamicModalForm, {type FormField} from "../../../../../components/ui/modals/ModalForm.tsx";
import React, { useState } from "react";
import { useTeacherSubmit } from "../../hooks/teachers/useTeacherSubmit.ts";
import type { modeTypes } from "../../../types/types.ts";

interface TeacherFormModalProps {
    mode: modeTypes;
    onClose: () => void;
    initialData: any | null;
    onSuccess: () => void;
}

const FORM_REGEX = {
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']{2,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
};

export function TeacherFormModal({ mode, onClose, onSuccess, initialData }: TeacherFormModalProps) {
    const isCreateMode = mode === 'create';

    const [formData, setFormData] = useState({
        firstName: initialData?.teacher_first_name || "",
        middleName: initialData?.teacher_middle_name || "",
        firstLastName: initialData?.teacher_first_last_name || "",
        secondLastName: initialData?.teacher_second_last_name || "",
        email: "",
        password: ""
    });

    const { loading, error, setError, teacherSubmit } = useTeacherSubmit(onSuccess);

    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!FORM_REGEX.name.test(formData.firstName)) {
            setError("El primer nombre debe tener entre 2 y 50 caracteres (solo letras).");
            return;
        }
        if (!FORM_REGEX.name.test(formData.firstLastName)) {
            setError("El primer apellido debe tener entre 2 y 50 caracteres (solo letras).");
            return;
        }
        if (formData.middleName.trim() && !FORM_REGEX.name.test(formData.middleName)) {
            setError("El segundo nombre debe tener entre 2 y 50 caracteres (solo letras).");
            return;
        }
        if (formData.secondLastName.trim() && !FORM_REGEX.name.test(formData.secondLastName)) {
            setError("El segundo apellido debe tener entre 2 y 50 caracteres (solo letras).");
            return;
        }

        if (isCreateMode) {
            if (!FORM_REGEX.email.test(formData.email)) {
                setError("Por favor, ingresa un correo electrónico válido.");
                return;
            }
            if (!FORM_REGEX.password.test(formData.password)) {
                setError("La contraseña debe tener mínimo 8 caracteres, e incluir al menos una letra, un número y un carácter especial.");
                return;
            }
        }


        const payload = {
            firstName: formData.firstName.trim().toLowerCase(),
            middleName: formData.middleName.trim().toLowerCase(),
            firstLastName: formData.firstLastName.trim().toLowerCase(),
            secondLastName: formData.secondLastName.trim().toLowerCase(),
            ...(isCreateMode && {
                password: formData.password,
                email: formData.email.trim().toLowerCase(),
            })
        };

        await teacherSubmit(mode, initialData?.id, payload);
    }

    const teacherFields: FormField[] = [
        { name: "firstName", label: "Primer Nombre", type: "text", placeholder: "Cristian", required: true },
        { name: "middleName", label: "Segundo Nombre", type: "text", placeholder: "Antonio", required: false },
        { name: "firstLastName", label: "Primer Apellido", type: "text", placeholder: "Garcia", required: true },
        { name: "secondLastName", label: "Segundo Apellido", type: "text", placeholder: "Perez", required: false },
        ...(isCreateMode ? [
            { name: "email", label: "Correo electrónico", type: "email", placeholder: "example@gmail.com", required: true } as FormField,
            { name: "password", label: "Contraseña", type: "password", required: true } as FormField] : [])
    ];

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
        if (error) setError("");
    }

    return (
        <DynamicModalForm
            isOpen={true}
            title={isCreateMode ? "Crear Nuevo Profesor" : "Editar Profesor"}
            fields={teacherFields}
            formData={formData}
            formError={error}
            formLoading={loading}
            onChange={handleFormChange}
            onSubmit={handleModalSubmit}
            onClose={onClose}
        />
    )
}