import {DeleteButton, EditButton} from "../../../../../components/ui/buttons/Buttons.tsx";
import {LoadingContent} from "../../../../../components/ui/Loadings.tsx";

interface AreaDetailsRowsProps {
    subjects: any[];
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
                            <span className="font-medium text-custom-black">{subject.name}</span>

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