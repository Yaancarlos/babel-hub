import { useState } from "react";
import { reverseName } from "../../../../../types";
import { type AssessmentCriteria, type Assignment, finalGradeForStudent, type Student } from "../../types";
import { AssignmentMenu } from "./AssignmentMenu.tsx";
import { HiPlus } from "react-icons/hi";
import { GradeCell } from "./GradeCell.tsx";

interface StudentGradeTableProps {
    students: Student[];
    assessments: AssessmentCriteria[];
    scaleMin: number;
    scaleMax: number;
    onAddAssignment: (a: AssessmentCriteria) => void;
    onEditAssignment: (ac: AssessmentCriteria, asg: Assignment) => void;
    onDeleteAssignment: (asg: Assignment) => void;
    onSaveAssignmentGrades: (assignmentId: string, records: { studentId: string; value: number | null }[]) => Promise<void>;
}

export function StudentGradeTable({
                                      assessments, students, scaleMin, scaleMax,
                                      onAddAssignment, onDeleteAssignment, onEditAssignment, onSaveAssignmentGrades
                                  }: StudentGradeTableProps) {
    const [dirty, setDirty] = useState<Record<string, Record<string, number | null>>>({});
    const [saving, setSaving] = useState<string | null>(null);

    const handleCellCommit = (assignmentId: string, studentId: string, value: number | null) => {
        setDirty((prev) => ({
            ...prev,
            [assignmentId]: { ...(prev[assignmentId] ?? {}), [studentId]: value }
        }));
    };

    const handleSave = async (assignmentId: string) => {
        const changes = dirty[assignmentId];
        if (!changes) return;

        const records = Object.entries(changes).map(([studentId, value]) => ({ studentId, value }));

        setSaving(assignmentId);
        try {
            await onSaveAssignmentGrades(assignmentId, records);
            setDirty((prev) => {
                const next = { ...prev };
                delete next[assignmentId];
                return next;
            });
        } finally {
            setSaving(null);
        }
    };

    const getDisplayValue = (assignment: Assignment, studentId: string): number | null => {
        const dirtyValue = dirty[assignment.id]?.[studentId];
        if (dirtyValue !== undefined) return dirtyValue;
        const grade = assignment.grades.find((g) => g.student_id === studentId);
        return grade ? grade.value : null;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
                <thead>
                <tr className="border-b border-gray-200">
                    <th className="sticky left-0 z-10 bg-white p-3" />
                    {assessments.map((ac) => {
                        const has = ac.assignments.length > 0;
                        if (!has) {
                            return (
                                <th
                                    key={ac.id}
                                    onClick={() => onAddAssignment(ac)}
                                    className="cursor-pointer border-l border-gray-200 bg-gray-50 p-2 text-center align-middle transition-colors hover:bg-gray-100"
                                >
                                    <span className="block text-sm font-medium capitalize text-gray-500">{ac.name}</span>
                                    <span className="mt-0.5 block text-[10px] text-gray-400">
                                            {ac.weight}% · añadir asignación
                                        </span>
                                </th>
                            );
                        }
                        return (
                            <th key={ac.id} colSpan={ac.assignments.length} className="border-l border-gray-200 bg-indigo-50 p-2 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                    <span className="text-sm font-semibold capitalize text-indigo-600">{ac.name}</span>
                                    <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-indigo-600">
                                            {ac.weight}%
                                        </span>
                                    <button
                                        onClick={() => onAddAssignment(ac)}
                                        aria-label={`Añadir asignación a ${ac.name}`}
                                        className="rounded-full p-1 text-indigo-600 transition-colors hover:bg-indigo-100"
                                    >
                                        <HiPlus className="size-3.5" />
                                    </button>
                                </div>
                            </th>
                        );
                    })}
                    <th className="border-l border-gray-200 bg-white p-3 text-center align-middle text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Final
                    </th>
                </tr>

                <tr className="border-b-2 border-indigo-200">
                    <th className="sticky left-0 z-10 bg-white py-2 px-3 text-sm font-semibold text-gray-900">Estudiantes</th>
                    {assessments.map((ac) =>
                        ac.assignments.length > 0 ? (
                            ac.assignments.map((asg, i) => {
                                const isDirty = Object.keys(dirty[asg.id] ?? {}).length > 0;
                                return (
                                    <th key={asg.id} className="group min-w-[72px] border-l border-gray-100 p-2 align-top">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center justify-center gap-0.5">
                                                    <span className="truncate text-xs font-medium text-gray-900" title={asg.name}>
                                                        {`${asg.name.split(" ")[0].charAt(0).toUpperCase()}${i + 1}`}
                                                    </span>
                                                <AssignmentMenu
                                                    assessmentCriteria={ac}
                                                    assignment={asg}
                                                    onEditAssignment={onEditAssignment}
                                                    onDeleteAssignment={onDeleteAssignment}
                                                />
                                            </div>
                                            {isDirty && (
                                                <button
                                                    onClick={() => handleSave(asg.id)}
                                                    disabled={saving === asg.id}
                                                    className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-primary/90 disabled:opacity-50"
                                                >
                                                    {saving === asg.id ? '...' : 'Guardar'}
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                );
                            })
                        ) : (
                            <th key={`${ac.id}-empty`} className="min-w-[72px] border-l border-gray-100 p-2 text-center text-xs text-gray-400">—</th>
                        ),
                    )}
                    <th className="border-l border-gray-200 bg-white" />
                </tr>
                </thead>

                <tbody>
                {students.map((student) => {
                    const displayName = reverseName({
                        firstName: student.first_name,
                        firstLastName: student.first_last_name,
                        middleName: student.middle_name,
                        secondLastName: student.second_last_name,
                    });
                    const final = finalGradeForStudent(assessments, student.student_id);
                    return (
                        <tr key={student.student_id} className="border-t border-gray-100 transition-colors hover:bg-gray-50">
                            <td className="sticky left-0 z-10 border-r border-gray-200 bg-white p-3">
                                <div className="max-w-[220px] truncate text-sm font-medium capitalize text-gray-900">{displayName}</div>
                                <div className="truncate text-xs text-gray-500">{student.email}</div>
                            </td>

                            {assessments.map((ac) =>
                                ac.assignments.length > 0 ? (
                                    ac.assignments.map((asg) => (
                                        <GradeCell
                                            key={asg.id}
                                            value={getDisplayValue(asg, student.student_id)}
                                            studentName={displayName}
                                            assignmentName={asg.name}
                                            minValue={scaleMin}
                                            maxValue={scaleMax}
                                            onCommit={(value) => handleCellCommit(asg.id, student.student_id, value)}
                                        />
                                    ))
                                ) : (
                                    <td key={`${ac.id}-empty`} className="p-1 text-center text-sm text-gray-300">—</td>
                                ),
                            )}

                            <td className="border-l border-gray-200 bg-white p-3 text-center">
                                    <span className="text-sm font-bold tabular-nums">
                                        {final === null ? '—' : final.toFixed(1)}
                                    </span>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}