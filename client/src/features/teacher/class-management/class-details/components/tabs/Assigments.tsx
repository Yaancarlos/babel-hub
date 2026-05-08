import type { Assignment } from "../../types";
import { NoResults } from "../../../../../../components/ui/blocks/NoResults.tsx";

interface AssignmentsProps {
    assignments: Assignment[];
}

export function Assignments({ assignments }: AssignmentsProps) {
    if (assignments.length === 0) {
        return (
            <div className="md:col-span-2 lg:col-span-3">
                <NoResults title="No hay asignaciones creadas todavía" />
            </div>
        )
    }

    return (
        <div className="grid bg-white grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all bg-white flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="font-bold text-custom-black leading-tight">{assignment.title}</h3>
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shrink-0">
                            {assignment.type}
                        </span>
                    </div>
                    <div className="mt-auto pt-3 border-t border-gray-50">
                        <p className="text-xs text-gray-500 font-medium mb-3">
                            Entrega: <span className="text-gray-700">{new Date(assignment.due_date).toLocaleDateString()}</span>
                        </p>
                        <button className="text-sm text-primary-600 font-bold hover:text-primary-800 w-full text-left transition-colors">
                            Ver Calificaciones
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}