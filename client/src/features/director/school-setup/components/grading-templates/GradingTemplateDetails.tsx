import { useGradingTemplateDetails } from "../../hooks/assessment-criteria/useGradingTemplateDetails.ts";
import { useNavigate, useParams } from "react-router-dom";
import ButtonChevronBack from "../../../../../components/ui/buttons/ButtonChevrowBack.tsx";
import { PrimaryButton } from "../../../../../components/ui/buttons/Buttons.tsx";
import type { ModalModeTypes } from "../../../../../types";
import { useState } from "react";
import { AssessmentRows } from "../ui/AssessmentRows.tsx";
import { ConfirmModal } from "../../../../../components/ui/modals/ConfirmModal.tsx";
import type { Assessment } from "../../types";
import { AssessmentFormModal } from "../ui/AssessmentFormModal.tsx";
import { useDeleteAssessment } from "../../hooks/assessment-criteria/useDeleteAssessment.ts";

export default function GradingTemplateDetails() {
    const { gradingId } = useParams<{ gradingId: string }>();
    const navigate = useNavigate();

    const { loading, gradingTemplateDetails, refetch } = useGradingTemplateDetails(gradingId || "");
    const { loadingDelete, deleteAssessmentById } = useDeleteAssessment(refetch);

    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');
    const [assessmentToEdit, setAssessmentToEdit] = useState<Assessment | null>(null);
    const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);

    if (!gradingId) return null;

    const handleEdit = (assessment: Assessment) => {
        setAssessmentToEdit(assessment);
        setModalMode('edit');
    }

    const handleDelete = (assessment: Assessment) => {
        setAssessmentToDelete(assessment);
    }

    const handleCreate = () => {
        setAssessmentToEdit(null);
        setModalMode('create');
    }

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center gap-3">
                    <ButtonChevronBack onClick={() => navigate(-1)} />
                    <div>
                        <h1 className="text-2xl font-bold text-custom-black">
                            Template: {gradingTemplateDetails?.grading_name}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Gestión de Criterios de Evaluación</p>
                    </div>
                </div>
                <div className="mt-4 md:mt-0">
                    <PrimaryButton
                        onClick={handleCreate}
                        title="Nuevo Criterio"
                    />
                </div>
            </div>

            <AssessmentRows
                loading={loading}
                assessments={gradingTemplateDetails?.assessments}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ConfirmModal
                isOpen={assessmentToDelete !== null}
                onClose={() => setAssessmentToDelete(null)}
                onConfirm={async () => {
                    if (assessmentToDelete) {
                        await deleteAssessmentById(assessmentToDelete.id);
                        setAssessmentToDelete(null);
                    }
                }}
                title="¿Estás seguro?"
                message={`¿Quieres eliminar el criterio de ${assessmentToDelete?.name}?`}
                loadingDelete={loadingDelete}
            />

            {modalMode !== 'none' && (
                <AssessmentFormModal
                    mode={modalMode}
                    onSuccess={async () => {
                        setAssessmentToEdit(null);
                        setModalMode('none');
                        await refetch();
                    }}
                    gradingTemplateId={gradingId}
                    assessment={assessmentToEdit}
                    onClose={() => {
                        setAssessmentToEdit(null);
                        setModalMode('none');
                    }}
                />
            )}
        </div>
    )
}