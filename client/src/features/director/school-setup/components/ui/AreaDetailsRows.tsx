import { DeleteButton, EditButton } from "../../../../../components/ui/buttons/Buttons.tsx";
import { LoadingContent } from "../../../../../components/ui/Loadings.tsx";
import type { SubjectsProps } from "../../types";

interface AreaDetailsRowsProps {
    subjects: SubjectsProps[];
    loading: boolean;
    onEdit: (area: any) => void;
    onDelete: (area: any) => void;
}

export function AreaDetailsRows ({ subjects, onEdit, loading, onDelete }: AreaDetailsRowsProps) {
    if (loading) return <LoadingContent title='Cargando' />;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {subjects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay materias registradas en esta área todavía.</p>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {subjects.map((subject) => (
                        <li key={subject.id} className="py-4 flex justify-between items-center hover:bg-gray-50 px-4 rounded-lg transition-colors">
                            <div>
                                <p className="font-medium text-base text-custom-black">{subject.name}</p>
                                <span className="font-base text-xs uppercase text-gray-300">{subject.grading_template_id}</span>
                            </div>

                            <div className="space-x-4">
                                <EditButton onClick={() => onEdit(subject)} />
                                <DeleteButton  onClick={() => onDelete(subject)}/>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}