import { NoResults } from "../../../../../components/ui/blocks/NoResults.tsx";
import { useAssignmentOverview } from "../../hooks/useAssignmentOverview.ts";
import { reverseName } from "../../../../../types";
import {IoMdAdd} from "react-icons/io";

interface AssignmentsProps {
    courseId: string;
    classId: string;
}

export function Assignments({ classId, courseId }: AssignmentsProps) {
    const { assignmentsOverview, loading } = useAssignmentOverview(courseId, classId);

    console.log("assignmentsOverview", assignmentsOverview);

    if (loading) return null;

    if (!assignmentsOverview || assignmentsOverview.assessment_criteria.length === 0) {
        return (
            <div className="md:col-span-2 lg:col-span-3">
                <NoResults title="No hay criterios de evaluación configurados todavía" />
            </div>
        );
    }

    const activities = {
        assessment_criteria: "",
        assessment_name: "activities",
        assignments: {
            assignment_id: "",
            assignment_name: "",
            grades: {
                grade_id: "",
                grade_value: "",
                student_id: ""
            }
        }
    }

    const handleAddAssignment = (ac: any) => {}

    const { students, assessment_criteria } = assignmentsOverview;

    return (
        <div className="space-y-6">
            {students.length > 0 && assessment_criteria.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead>
                        <tr className="border-b border-gray-100">
                            <th className="sticky left-0 bg-white z-10"></th>
                            {assessment_criteria.map((ac) => {
                                const hasAssignments = ac.assignments.length > 0;
                                return (
                                        hasAssignments ? (
                                            <th
                                                key={ac.id}
                                                colSpan={hasAssignments ? ac.assignments.length : 1}
                                                className={`text-sm text-center font-medium bg-primary/10 text-primary last:rounded-tr-md font-normal group relative ${i === 0 ? 'rounded-tl-md' : ''}`}
                                            >
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="capitalize">{ac.name}</span>
                                                    <button
                                                        onClick={() => handleAddAssignment(ac)}
                                                        className="hover:bg-primary/20 p-1 rounded-full cursor-pointer"
                                                    >
                                                        <IoMdAdd className="text-sm" />
                                                    </button>
                                                </div>
                                            </th>
                                        ) : (
                                            <th
                                                key={ac.id}
                                                colSpan={hasAssignments ? ac.assignments.length : 1}

                                                onClick={() => handleAddAssignment(ac)}
                                                className="text-sm text-center font-medium bg-gray-50 text-gray-400 cursor-pointer hover:bg-gray-100"
                                            >
                                                <span className="capitalize">{ac.name}</span>
                                                <span className="block text-[10px]">Sin asignaciones — click para añadir</span>
                                            </th>
                                        )
                                );
                            })}
                        </tr>

                        <tr className="border-b-2 border-primary/30">
                            <th className="sticky left-0 bg-white z-10 p-2 text-sm font-medium text-custom-black text-left">
                                Estudiantes
                            </th>
                            {assessment_criteria.map((ac) => (
                                ac.assignments.length > 0 ? (
                                    ac.assignments.map((asg, idx) => (
                                        <th key={asg.id} className="text-xs text-center p-2 font-normal text-gray-500 min-w-[60px]">
                                            A{idx + 1}
                                        </th>
                                    ))
                                ) : (
                                    <th key={`${ac.id}-empty`} className="text-xs text-center p-2 font-normal text-gray-300 min-w-[60px]">
                                        —
                                    </th>
                                )
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="sticky left-0 bg-white p-4 border-r border-gray-100 z-10">
                                    <div className="truncate max-w-[200px] capitalize font-medium text-custom-black text-sm">
                                        {reverseName({
                                            firstName: student.first_name,
                                            firstLastName: student.first_last_name,
                                            middleName: student.middle_name,
                                            secondLastName: student.second_last_name
                                        })}
                                    </div>
                                </td>

                                {assessment_criteria.map((ac) => (
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
            )}
        </div>
    )
}