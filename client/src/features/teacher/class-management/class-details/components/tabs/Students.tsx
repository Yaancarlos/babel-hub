import { getInitials, reverseName } from "../../../../../../types";
import type { Student } from "../../types";
import { NoResults } from "../../../../../../components/ui/blocks/NoResults.tsx";

interface StudentsProps {
    students: Student[]
}

export function Students({ students }: StudentsProps) {
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                { students.length === 0 ? ( <NoResults title="No hay estudiantes en este curso." /> ) : (
                    <table className="w-full min-w-md text-center border-collapse">
                        <thead>
                        <tr className="bg-primary-shadow text-primary border-b border-primary-shadow">
                            <th className="py-3 md:py-4 px-4 md:text-base md:px-5 lg:px-6 text-sm text-left font-semibold ">Estudiante</th>
                            <th className="py-3 md:py-4 px-4 md:text-base md:px-5 lg:px-6 text-sm font-semibold ">Promedio</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {students.map((student) => (
                            <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-6">
                                    <div className="flex items-center text-left gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary-shadow text-primary-darker flex items-center justify-center text-xs md:text-sm font-bold shrink-0">
                                            {getInitials(student.student_name)}
                                        </div>
                                        <div className="max-w-48 py-0.5">
                                        <span className="block font-medium truncate capitalize text-custom-black text-sm md:text-base leading-normal">
                                            {reverseName(student.student_name)}
                                        </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 text-center px-6">
                                    <span className="text-xs md:text-sm font-medium text-gray-700">—</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) }
            </div>
        </div>
    )
}