import type { Teacher } from "../../types";
import { TeacherRow } from "../ui/TeacherRows.tsx";

interface TeacherTableProps {
    teachers: Teacher[];
    onEdit: (teacher: Teacher) => void;
    onDelete: (teacher: Teacher) => void;
    onNavigate: (id: any) => void;
}

export function TeacherTable({ teachers, onNavigate, onEdit, onDelete }: TeacherTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                    <th className="p-4 text-sm font-semibold">Profesores ({teachers.length})</th>
                    <th className="p-4 text-sm font-semibold">Clases Asignadas</th>
                    <th className="p-4 text-sm font-semibold">Fecha de Contratación</th>
                    <th className="p-4 text-sm font-semibold text-right">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {teachers.map((teacher) => (
                    <TeacherRow
                        key={teacher.id}
                        teacher={teacher}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onNavigate={onNavigate}
                    />
                ))}
                </tbody>
            </table>
        </div>
    )
}