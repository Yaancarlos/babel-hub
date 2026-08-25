import type { AssessmentCriteria, Assignment, ClassDetailsData, GradeRecords } from "../../types";
import { NoResults } from "../../../../../../components/ui/blocks/NoResults.tsx";
import { StudentGradeTable } from "../../../../../../components/ui/table/StudentGradeTable.tsx";
import { ConfirmModal } from "../../../../../../components/ui/modals/ConfirmModal.tsx";
import { useState } from "react";
import type { ModalModeTypes } from "../../../../../../types";
import { useAssignmentOverview } from "../../hooks/assignments/useAssignmentOverview.ts";
import { useClassScale } from "../../hooks/assignments/useClassScale.ts";
import { useAssignmentDelete } from "../../hooks/assignments/useAssignmentDelete.ts";
import { useBulkAssignments } from "../../hooks/assignments/useBulkAssignments.ts";
import {AssignmentFormModal} from "../ui/AssignmentFormModal.tsx";

interface AssignmentsProps {
    classData: ClassDetailsData;
    classId: string;
    courseId: string;
}

export function Assignments({ classData, courseId, classId }: AssignmentsProps) {
    const [modalMode, setModalMode] = useState<ModalModeTypes>("none");
    const [assessmentId, setAssessmentId] = useState<string>("");
    const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(null);
    const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

    const { assignmentsOverview, loading, refetch } = useAssignmentOverview(courseId, classId);
    const { scale, loadingScale } = useClassScale(classId);
    const { loadingDelete, deleteAssignmentById } = useAssignmentDelete(refetch);
    const { bulkUpsertGrades } = useBulkAssignments(refetch);

    console.log(assignmentsOverview)

    if (loading || loadingScale || !scale) return null;

    if (!assignmentsOverview || assignmentsOverview.length === 0) {
        return (
            <div className="md:col-span-2 border border-gray-100 rounded-xl lg:col-span-3">
                <NoResults title="No hay criterios de evaluación configurados todavía"/>
            </div>
        );
    }

    const onAddAssignment = (assessment: AssessmentCriteria) => {
        setAssessmentId(assessment.id);
        setAssignmentToEdit(null);
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

    const handleSaveAssignmentGrades = async (assignmentId: string, records: GradeRecords[]) => {
        await bulkUpsertGrades(classId, assignmentId, records.map(r => ({
            studentId: r.studentId,
            value: r.value ?? scale.min_value,
            comment: r.comment ?? null
        })));
    };

    return (
        <div className="space-y-6">
            {classData.students.length > 0 && assignmentsOverview.length > 0 ? (
                <StudentGradeTable
                    students={classData.students}
                    assessments={assignmentsOverview}
                    scale={{ min: scale.min_value, max: scale.max_value, passing: scale.passing_value }}
                    onAddAssignment={onAddAssignment}
                    onEditAssignment={onEditAssignment}
                    onDeleteAssignment={onDeleteAssignment}
                    onSaveAssignmentGrades={handleSaveAssignmentGrades}
                />
            ) : (
                <div className="md:col-span-2 border rounded-xl border-gray-100 lg:col-span-3">
                    <NoResults title="No hay estudiantes para evaluar"/>
                </div>
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
                title="Eliminar asignación"
                message={`Se eliminará "${assignmentToDelete?.name}" y todas sus calificaciones. Esta acción no se puede deshacer.`}
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