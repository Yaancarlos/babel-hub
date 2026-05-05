import type { GradeRecord } from "../../types";

interface StudentInformationProps {
    grades: GradeRecord[];
}

export function StudentInformation({ grades }: StudentInformationProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base md:text-xl font-bold text-custom-black mb-4 border-b pb-2">Calificaciones Recientes</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                        <th className="p-3 font-semibold text-custom-black">Materia</th>
                        <th className="p-3 font-semibold text-custom-black">Asignación</th>
                        <th className="p-3 font-semibold text-custom-black">Nota</th>
                        <th className="p-3 font-semibold text-custom-black">Fecha</th>
                    </tr>
                    </thead>
                    <tbody>
                    {grades.map((grade) => (
                        <tr key={grade.assignment_id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-medium text-black">{grade.class_name}</td>
                            <td className="p-3 text-gray-600">{grade.assignment_title}</td>
                            <td className="p-3">
                                    <span className={`font-bold ${grade.grade_value >= 4.0 ? 'text-green-600' : grade.grade_value >= 3.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {grade.grade_value.toFixed(1)}
                                    </span>
                            </td>
                            <td className="p-3 text-gray-500 text-sm">{new Date(grade.graded_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {grades.length === 0 && (
                    <p className="text-gray-500 text-center py-6">No hay asignaciones creadas todavía.</p>
                )}
            </div>
        </div>
    )
}