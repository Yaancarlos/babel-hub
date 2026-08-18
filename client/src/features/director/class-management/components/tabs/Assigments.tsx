import { NoResults } from "../../../../../components/ui/blocks/NoResults.tsx";
import { useAssignmentOverview } from "../../hooks/useAssignmentOverview.ts";
import {type ModalModeTypes} from "../../../../../types";
import type { AssessmentCriteria, Assignment, ClassDetailsData } from "../../types";
import { useState } from "react";
import { StudentGradeTable } from "../ui/StudentGradeTable.tsx";
import { AssignmentFormModal } from "../ui/AssignmentFormModal.tsx";
import { ConfirmModal } from "../../../../../components/ui/modals/ConfirmModal.tsx";
import { useAssignmentDelete } from "../../hooks/useAssignmentDelete.ts";
import { useClassScale } from "../../hooks/useClassScale.ts";

interface AssignmentsProps {
    classData: ClassDetailsData;
    courseId: string;
    classId: string;
}

export function Assignments({ classData, classId, courseId }: AssignmentsProps) {
    const [modalMode, setModalMode] = useState<ModalModeTypes>("none");
    const [assessmentId, setAssessmentId] = useState<string>("");
    const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(null);
    const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

    const { assignmentsOverview, loading, refetch } = useAssignmentOverview(courseId, classId);
    const { scale, loadingScale } = useClassScale(classId);
    const { loadingDelete, deleteAssignmentById } = useAssignmentDelete(refetch);

    if (loading || loadingScale || !scale) return null;

    if (!assignmentsOverview || assignmentsOverview.length === 0) {
        return (
            <div className="md:col-span-2 lg:col-span-3">
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

    const handleSaveAssignmentGrades = async (
        assignmentId: string,
        records: {
            studentId: string;
            value: number | null;
            comment: string | null;
        }[]) => {
        /*await bulkUpsertGrades(assignmentId, records.map(r => ({
            studentId: r.studentId,
            value: r.value ?? 0,  // decide: does clearing a cell mean "0" or should it delete the grade row entirely?
            comment: null
        })));
        await refetch();*/

        console.log(assignmentId, records);
    };
    return (
        <div className="space-y-6">
            {classData.students.length > 0 && assignmentsOverview.length > 0 && (
                <StudentGradeTable
                    students={classData.students}
                    assessments={assignmentsOverview}
                    scaleMin={scale.min_value}
                    scaleMax={scale.max_value}
                    passing={scale.passing_value}
                    onAddAssignment={onAddAssignment}
                    onEditAssignment={onEditAssignment}
                    onDeleteAssignment={onDeleteAssignment}
                    onSaveAssignmentGrades={handleSaveAssignmentGrades}
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