import { useGradingTemplateData } from "../../hooks/grading-templates/useGradingTemplateData.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DeleteButton, EditButton } from "../../../../../components/ui/buttons/Buttons.tsx";
import type { GradingTemplate } from "../../types";
import type { ModalModeTypes } from "../../../../../types";
import { ConfirmModal } from "../../../../../components/ui/modals/ConfirmModal.tsx";
import { useDeleteGradingTemplate } from "../../hooks/grading-templates/useDeleteGradingTemplate.ts";
import { GradingTemplateModalMode } from "../ui/GradingTemplateModalMode.tsx";

export function GradingTemplateLayout() {
    const navigate = useNavigate();

    const [gradingTemplateToEdit, setGradingTemplateToEdit] = useState<GradingTemplate | null>(null);
    const [gradingTemplateToDelete, setGradingTemplateToDelete] = useState<GradingTemplate | null>(null);
    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');

    const { gradingTemplates, refetch } = useGradingTemplateData();
    const { loadingDelete, deleteGradingTemplateById } = useDeleteGradingTemplate(refetch);


    const handleNavigate = (id: string) => {
        navigate(`grading-templates/${id}`);
    }

    const handleDelete = (gradingTemplate: GradingTemplate) => {
        setGradingTemplateToDelete(gradingTemplate);
    };

    const handleEdit = (gradingTemplate: GradingTemplate) => {
        setGradingTemplateToEdit(gradingTemplate);
        setModalMode("edit");
    };

    const handleCreate = () => {
        setGradingTemplateToEdit(null);
        setModalMode("create");
    };

    return (
        <div className="w-full">
            <ul className="flex flex-col gap-1">
                {
                    gradingTemplates.map((gradingTemplate: GradingTemplate) => (
                        <li
                            key={gradingTemplate.id}
                            className="w-full text-left p-2 rounded-lg text-sm font-medium text-custom-black hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => handleNavigate(gradingTemplate.id)}
                                    className="cursor-pointer capitalize text-sm font-medium"
                                >
                                    {gradingTemplate.name}
                                </button>
                                <div className="flex gap-2">
                                    <EditButton onClick={() => handleEdit(gradingTemplate)} />
                                    <DeleteButton onClick={() => handleDelete(gradingTemplate)} />
                                </div>
                            </div>
                        </li>
                    ))
                }
                <li className="flex items-center justify-end">
                    <button
                        className="cursor-pointer py-2 px-3 rounded-xl transition-colors text-sm font-bold text-primary hover:text-white hover:bg-primary"
                        onClick={handleCreate}
                    >
                        Añadir nuevo template
                    </button>
                </li>
            </ul>

            <ConfirmModal
                isOpen={gradingTemplateToDelete !== null}
                onClose={() => setGradingTemplateToDelete(null)}
                title="¿Estás seguro?"
                message={`¿Quieres eliminar el template ${gradingTemplateToDelete?.name}?`}
                onConfirm={async () => {
                    if (gradingTemplateToDelete) {
                        await deleteGradingTemplateById(gradingTemplateToDelete.id);
                        setGradingTemplateToDelete(null);
                    }
                }}
                loadingDelete={loadingDelete}
            />

            {
                modalMode !== "none" && (
                    <GradingTemplateModalMode
                        mode={modalMode}
                        gradingTemplate={gradingTemplateToEdit}
                        gradingTemplateId={gradingTemplateToEdit ? gradingTemplateToEdit.id : null}
                        onSuccess={ async () => {
                            setGradingTemplateToEdit(null);
                            setModalMode("none");
                            await refetch();
                        }}
                        onCancel={() => {
                            setGradingTemplateToEdit(null);
                            setModalMode("none");
                        }}
                    />
                )
            }
        </div>
    )
}