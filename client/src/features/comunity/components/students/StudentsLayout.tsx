import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { StudentsTable } from "./StudentsTable.tsx";
import ButtonChevronBack from "../../../../components/ui/buttons/ButtonChevrowBack.tsx";
import { PrimaryButton } from "../../../../components/ui/buttons/Buttons.tsx";
import { ConfirmModal } from "../../../../components/ui/modals/ConfirmModal.tsx";
import { StudentFormModal } from "../ui/StudentFormModal.tsx";
import { LoadingContent } from "../../../../components/ui/Loadings.tsx";
import { useStudentsData } from "../../hooks/students/useStudentsData.ts";
import { useStudentDelete } from "../../hooks/students/useStudentDelete.ts";
import type { ModalModeTypes } from "../../../../types";

export function StudentsLayout() {
    const navigate = useNavigate();

    const { students, loading, reloadStudents } = useStudentsData();
    const { deleteStudentById, loadingDelete } = useStudentDelete(reloadStudents);

    const [searchTerm, setSearchTerm] = useState("");
    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');
    const [studentToEdit, setStudentToEdit] = useState<any>(null);
    const [studentToDelete, setStudentToDelete] = useState<any>(null);

    const filteredStudents = students.filter((student: any) =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.enrollment_code && student.enrollment_code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleOpenEdit = useCallback((student: any) => {
        setStudentToEdit(student);
        setModalMode('edit');
    }, []);

    const handleOpenDelete = useCallback((studentId: string) => {
        const student = students.find((s: any) => s.student_id === studentId);
        setStudentToDelete(student || null);
    }, [students]);

    const handleNavigate = useCallback((id: string) => {
        navigate(`${id}`);
    }, [navigate]);


    if (loading) return <LoadingContent title="Cargando estudiantes..." />;

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex gap-2">
                    <ButtonChevronBack onClick={() => navigate(-1)} />
                    <h2 className="text-xl md:text-1xl xl:text-2xl font-bold text-custom-black">Estudiantes</h2>
                </div>
                <div className="flex grow w-full gap-2 justify-end items-center">
                    <div className="w-full sm:max-w-xs xl:max-w-xl">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, correo o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 xl:py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition-shadow"
                        />
                    </div>
                    <PrimaryButton
                        onClick={() => {
                            setStudentToEdit(null);
                            setModalMode('create');
                        }}
                        title="+"
                        className="max-w-[50px]"
                    />
                </div>
            </div>

            <StudentsTable
                students={filteredStudents}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onNavigate={handleNavigate}
            />

            <ConfirmModal
                isOpen={studentToDelete !== null}
                onClose={() => setStudentToDelete(null)}
                title="¿Estás seguro?"
                message={`¿Quieres eliminar al estudiante ${studentToDelete?.full_name}? Esta acción no se puede deshacer.`}
                onConfirm={async () => {
                    if (studentToDelete) {
                        await deleteStudentById(studentToDelete.student_id);
                        setStudentToDelete(null);
                    }
                }}
                loadingDelete={loadingDelete}
            />

            {modalMode !== 'none' && (
                <StudentFormModal
                    mode={modalMode}
                    initialData={studentToEdit}
                    onClose={() => setModalMode('none')}
                    onSuccess={async () => {
                        setModalMode('none');
                        await reloadStudents();
                    }}
                />
            )}
        </div>
    );
}