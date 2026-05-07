import { useNavigate } from "react-router-dom";
import type { ClassItem } from "../../types";

interface TeacherProfileProps {
    teacher: ClassItem[];
}

export function TeacherInformation({ teacher }: TeacherProfileProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg md:text-xl font-bold text-custom-black">Horario / Clases Asignadas ({teacher.length})</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Materias que este profesor dicta actualmente.
                </p>
            </div>

            {teacher.length === 0 ? (
                <div className="p-10 text-center">
                    <p className="text-gray-500 font-medium text-lg">Este profesor no tiene clases asignadas.</p>
                    <p className="text-sm mt-1 text-gray-400">Puedes asignarle clases desde la vista de Cursos.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                            <th className="p-4 text-sm font-semibold pl-6">Materia</th>
                            <th className="p-4 text-sm font-semibold">Curso</th>
                            <th className="p-4 text-sm font-semibold text-right pr-6">Acción</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {teacher.map((cls) => (
                            <tr key={cls.class_id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 pl-6 font-medium text-sm md:text-base text-custom-black">
                                    {cls.subject_name}
                                </td>
                                <td className="p-4">
                                            <span className="bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded text-xs border border-gray-200">
                                                {cls.course_name}
                                            </span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button
                                        disabled={true}
                                        onClick={() => navigate(`/principal/clase/${cls.class_id}`)}
                                        className="text-sm font-semibold text-gray-300 cursor-not-allowed transition-colors"
                                    >
                                        Ver Clase
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}