import { useAreaDetails } from "../../hooks/areas/useAreaDetails.ts";
import { useNavigate, useParams } from "react-router-dom";
import ButtonChevronBack from "../../../../../components/ui/buttons/ButtonChevrowBack.tsx";
import { PrimaryButton } from "../../../../../components/ui/buttons/Buttons.tsx";
import type { ModalModeTypes } from "../../../../../types";
import {  useState  } from "react";
import { ConfirmModal } from "../../../../../components/ui/modals/ConfirmModal.tsx";
import { useDeleteSubject } from "../../hooks/subjects/useDeleteSubject.ts";
import type { SubjectsProps } from "../../types";
import { AreaDetailsFormModal } from "../ui/AreaDetailsFormModal.tsx";
import { ListRows } from "../../../../../components/ui/lists/SetupList.tsx";

export function AreaDetails() {
    const { areaId } = useParams<{ areaId: string }>();
    const navigate = useNavigate();

    if (!areaId) return null;

    const { loading, areaDetails, refetch } = useAreaDetails(areaId);
    const { loadingDelete, deleteSubjectById } = useDeleteSubject(refetch);

    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');
    const [subjectToEdit, setSubjectToEdit] = useState<SubjectsProps | null>(null);
    const [subjectToDelete, setSubjectToDelete] = useState<SubjectsProps | null>(null);

    const handleEdit = (subject: SubjectsProps) => {
        setSubjectToEdit(subject);
        setModalMode('edit');
    }

    const handleDelete = (subject: SubjectsProps) => {
        setSubjectToDelete(subject);
    }

    return (
        <div className="md:space-y-5">
            <div className="bg-white md:rounded-xl md:border md:border-gray-100 p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-2">
                        <ButtonChevronBack onClick={() => navigate(-1)} />
                        <div>
                            <h1 className="text-xl md:text-2xl capitalize font-bold text-custom-black">
                                {areaDetails?.area.name}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Gestión de Asignaturas</p>
                        </div>
                    </div>
                    <div>
                        <PrimaryButton
                            className="px-2"
                            onClick={() => setModalMode('create')}
                            title="Nueva Asignatura"
                        />
                    </div>
                </div>
            </div>

            <ListRows
                items={areaDetails ? areaDetails.subjects : []}
                loading={loading}
                emptyMessage="No hay materias registradas en esta área todavía."
                getKey={(s) => s.id}
                getTitle={(s) => s.name}
                getSubtitle={(s) => s.grading_template_name}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ConfirmModal
                isOpen={subjectToDelete !== null}
                onClose={() => setSubjectToDelete(null)}
                onConfirm={async () => {
                    if (subjectToDelete) {
                        await deleteSubjectById(subjectToDelete.id);
                        setSubjectToDelete(null);
                    }
                }}
                title="¿Estás seguro?"
                message={`¿Quieres eliminar la asignatura de ${subjectToDelete?.name}?`}
                loadingDelete={loadingDelete}
            />

            {modalMode !== 'none' && (
                <AreaDetailsFormModal
                    mode={modalMode}
                    onSuccess={async () => {
                        setSubjectToEdit(null);
                        setModalMode('none');
                        refetch();
                    }}
                    areaId={areaId}
                    subject={subjectToEdit}
                    onClose={() => {
                        setSubjectToEdit(null);
                        setModalMode('none');
                    }}
                />
            )}
        </div>
    )
}