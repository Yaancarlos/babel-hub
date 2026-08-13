import { reverseName } from "../../../../../types";
import type { AssessmentCriteria, Assignment, Student } from "../../types";
import { AssignmentMenu } from "./AssignmentMenu.tsx";
import {HiPlus} from "react-icons/hi";

interface StudentGradeTableProps {
    students: Student[];
    assessments: AssessmentCriteria[];
    onAddAssignment: (a: AssessmentCriteria) => void;
    onEditAssignment: (ac: AssessmentCriteria, asg: Assignment) => void;
    onDeleteAssignment: (asg: Assignment) => void;

}

export function StudentGradeTable({ assessments, students, onAddAssignment, onDeleteAssignment, onEditAssignment }: StudentGradeTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
                <thead>
                <tr className="border-b border-gray-200">
                    <th className="sticky left-0 z-10 bg-white p-3" />
                    {assessments.map((ac) => {
                        const has = ac.assignments.length > 0
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
                            )
                        }
                        return (
                            <th
                                key={ac.id}
                                colSpan={ac.assignments.length}
                                className="border-l border-gray-200 bg-indigo-50 p-2 text-center"
                            >
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
                        )
                    })}
                    <th className="border-l border-gray-200 bg-white p-3 text-center align-middle text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Final
                    </th>
                </tr>

                <tr className="border-b-2 border-indigo-200">
                    <th className="sticky left-0 z-10 bg-white py-2 px-3 text-sm font-semibold text-gray-900">Estudiantes</th>
                    {assessments.map((ac) =>
                        ac.assignments.length > 0 ? (
                            ac.assignments.map((asg, i) => (
                                <th
                                    key={asg.id}
                                    className="group min-w-[72px] border-l border-gray-100 p-2 align-top"
                                >
                                    <div className="flex items-center justify-center gap-0.5">
                                        <span className="truncate text-xs font-medium text-gray-900" title={asg.name}>
                                            {`${asg.name.split(" ")[0].charAt(0).toUpperCase()}${i+1}`}
                                        </span>
                                        <AssignmentMenu
                                            assessmentCriteria={ac}
                                            assignment={asg}
                                            onEditAssignment={onEditAssignment}
                                            onDeleteAssignment={onDeleteAssignment}
                                        />
                                    </div>
                                </th>
                            ))
                        ) : (
                            <th key={`${ac.id}-empty`} className="min-w-[72px] border-l border-gray-100 p-2 text-center text-xs text-gray-400">
                                —
                            </th>
                        ),
                    )}
                    <th className="border-l border-gray-200 bg-white" />
                </tr>
                </thead>

                <tbody>
                {students.map((student) => (
                    <tr key={student.student_id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="sticky left-0 bg-white p-3 border-r border-gray-100 z-10">
                            <div className="truncate max-w-[200px] capitalize font-medium text-custom-black text-sm">
                                {reverseName({
                                    firstName: student.first_name,
                                    firstLastName: student.first_last_name,
                                    middleName: student.middle_name,
                                    secondLastName: student.second_last_name
                                })}
                            </div>
                        </td>

                        {assessments.map((ac) => (
                            ac.assignments.length > 0 ? (
                                ac.assignments.map((asg) => (
                                    <td key={asg.id} className="text-center text-sm text-gray-400 p-4">
                                        —
                                    </td>
                                ))
                            ) : (
                                <td key={`${ac.id}-empty`} className="text-center text-sm text-gray-300 p-4">
                                    —
                                </td>
                            )
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}