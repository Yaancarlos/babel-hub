import type { Assessment } from "../../types";
import { DeleteButton, EditButton } from "../../../../../components/ui/buttons/Buttons.tsx";
import { LoadingContent } from "../../../../../components/ui/Loadings.tsx";

interface AssessmentRowProps {
    loading: boolean;
    assessments: Assessment[];
    onDelete: (assessment: Assessment) => void;
    onEdit: (assessment: Assessment) => void;
}

export function AssessmentRows({ loading, assessments, onDelete, onEdit }: AssessmentRowProps) {
    if (loading) return <LoadingContent title='Cargando' />;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {assessments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay materias registradas en esta área todavía.</p>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {assessments.map((assessment) => (
                        <li key={assessment.id} className="py-4 flex justify-between items-center hover:bg-gray-50 px-4 rounded-lg transition-colors">
                            <div>
                                <p className="font-medium text-base text-custom-black">{assessment.name}</p>
                                <span className="font-base text-xs uppercase text-gray-300">{assessment.weight}</span>
                            </div>

                            <div className="space-x-4">
                                <EditButton onClick={() => onEdit(assessment)} />
                                <DeleteButton  onClick={() => onDelete(assessment)}/>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}