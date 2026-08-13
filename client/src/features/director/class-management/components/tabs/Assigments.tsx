import { NoResults } from "../../../../../components/ui/blocks/NoResults.tsx";
import { useAssignmentOverview } from "../../hooks/useAssignmentOverview.ts";
import {type ModalModeTypes} from "../../../../../types";
import type { AssessmentCriteria, Assignment} from "../../types";
import { useState } from "react";
import { StudentGradeTable } from "../ui/StudentGradeTable.tsx";
import { AssignmentFormModal } from "../ui/AssignmentFormModal.tsx";
import {ConfirmModal} from "../../../../../components/ui/modals/ConfirmModal.tsx";
import {useAssignmentDelete} from "../../hooks/useAssignmentDelete.ts";

interface AssignmentsProps {
    courseId: string;
    classId: string;
}

export function Assignments({classId, courseId}: AssignmentsProps) {
    const [modalMode, setModalMode] = useState<ModalModeTypes>("none");
    const [assessmentId, setAssessmentId] = useState<string>("");
    const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(null);
    const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

    const { assignmentsOverview, loading, refetch } = useAssignmentOverview(courseId, classId);
    const { loadingDelete, deleteAssignmentById } = useAssignmentDelete(refetch);

    if (loading) return null;

    if (!assignmentsOverview || assignmentsOverview.assessment_criteria.length === 0) {
        return (
            <div className="md:col-span-2 lg:col-span-3">
                <NoResults title="No hay criterios de evaluación configurados todavía"/>
            </div>
        );
    }

    const onAddAssignment = (assessment: AssessmentCriteria) => {
        setAssessmentId(assessment.id);
        setModalMode("create")
    }

    const onDeleteAssignment = (assignment: Assignment) => {
        setAssignmentToDelete(assignment);
    }

    const onEditAssignment = (assessment: AssessmentCriteria, assignment: Assignment) => {
        setAssessmentId(assessment.id);
        setAssignmentToEdit(assignment);
        setModalMode("edit");
    }

    const {students, assessment_criteria} = assignmentsOverview;

    return (
        <div className="space-y-6">
            {students.length > 0 && assessment_criteria.length > 0 && (
                <StudentGradeTable
                    students={students}
                    assessments={assessment_criteria}
                    onAddAssignment={onAddAssignment}
                    onEditAssignment={onEditAssignment}
                    onDeleteAssignment={onDeleteAssignment}
                />
            )}

            <ConfirmModal
                isOpen={assignmentToDelete !== null}
                onClose={() => setAssignmentToDelete(null)}
                onConfirm={async () => {
                    if (assignmentToDelete) {
                        await deleteAssignmentById(assignmentToDelete.id);
                        setAssignmentToDelete(null);
                    }
                }}
                title="¿Estás seguro?"
                message={`¿Quieres eliminar la asignación ${assignmentToDelete?.name}? Esta acción no se puede deshacer.`}
                loadingDelete={loadingDelete}
            />

            {modalMode !== "none" && (
                <AssignmentFormModal
                    mode={modalMode}
                    onClose={() => {
                        setAssignmentToEdit(null);
                        setModalMode("none");
                    }}
                    onSuccess={async () => {
                        setAssignmentToEdit(null);
                        setModalMode('none');
                        refetch();
                    }}
                    assignment={{ classId, assessmentId }}
                    assignmentToEdit={assignmentToEdit}
                />
            )}
        </div>
    )
}