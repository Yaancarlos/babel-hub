import DynamicModalForm, {type FormField} from "../../../../../components/ui/modals/ModalForm.tsx";
import React, { useState } from "react";
import { useTeacherSubmit } from "../../hooks/teachers/useTeacherSubmit.ts";

interface TeacherFormModalProps {
    mode: 'edit' | 'create';
    onClose: () => void;
    initialData: any | null;
    onSuccess: () => void;
}

const formRegExp = [
    { label: "name", regExp: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']{2,50}$/ },
    { label: "email", regExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    { label: "password", regExp: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ },
];


export function TeacherFormModal({ mode, onClose, onSuccess, initialData }: TeacherFormModalProps) {
    const [formData, setFormData] = useState({
        fullName: initialData?.full_name || "",
        email: "",
        password: ""
    });

    const { loading, error, setError, teacherSubmit } = useTeacherSubmit(onSuccess);

    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const name = formRegExp.find(r => r.label === "name")?.regExp;
        const email = formRegExp.find(r => r.label === "email")?.regExp;
        const password = formRegExp.find(r => r.label === "password")?.regExp;

        if (name && !name.test(formData.fullName)) {
            setError("El nombre debe tener entre 2 y 50 caracteres y solo contener letras.");
            return;
        }

        if (mode === 'create') {
            if (email && !email.test(formData.email)) {
                setError("Por favor, ingresa un correo electrónico válido.");
                return;
            }
            if (password && !password.test(formData.password)) {
                setError("La contraseña debe tener mínimo 8 caracteres, e incluir al menos una letra, un número y un carácter especial.");
                return;
            }
        }

        const payload = {
            ...formData,
            fullName: formData.fullName.trim().toLowerCase()
        }

        await teacherSubmit(mode, initialData?.id, payload);
    }

    //@ts-ignore
    const teacherFields: FormField[] = [
        { name: "fullName", label: "Nombre", type: "text", placeholder: "Cristian Garcia", required: true },
        { name: "email", label: "Correo electronico", type: "email", placeholder: "example@gmail.com", required: true },
        { name: "password", label: "Contraseña", type: "password", required: true }
    ].filter(field => mode === 'create' || field.name === 'fullName');

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
        if (error) setError("");
    }

    return (
        <DynamicModalForm
            isOpen={true}
            title={mode === 'create' ? "Crear Nuevo Profesor" : "Editar Profesor"}
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