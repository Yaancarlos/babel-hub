import { useGradingTemplateData } from "../../hooks/grading-templates/useGradingTemplateData.ts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { GradingTemplate } from "../../types";
import type { ModalModeTypes } from "../../../../../types";
import { ConfirmModal } from "../../../../../components/ui/modals/ConfirmModal.tsx";
import { useDeleteGradingTemplate } from "../../hooks/grading-templates/useDeleteGradingTemplate.ts";
import { GradingTemplateModalMode } from "../ui/GradingTemplateModalMode.tsx";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";

export function GradingTemplateLayout() {
    const navigate = useNavigate();

    const [gradingTemplateToEdit, setGradingTemplateToEdit] = useState<GradingTemplate | null>(null);
    const [gradingTemplateToDelete, setGradingTemplateToDelete] = useState<GradingTemplate | null>(null);
    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');

    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const { gradingTemplates, refetch } = useGradingTemplateData();
    const { loadingDelete, deleteGradingTemplateById } = useDeleteGradingTemplate(refetch);

    useEffect(() => {
        if (!activeMenuId) return;
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [activeMenuId]);

    const handleNavigate = (id: string) => {
        navigate(`grading-templates/${id}`);
    }

    const handleDelete = (gradingTemplate: GradingTemplate) => {
        setGradingTemplateToDelete(gradingTemplate);
        setActiveMenuId(null);
    };

    const handleEdit = (gradingTemplate: GradingTemplate) => {
        setGradingTemplateToEdit(gradingTemplate);
        setModalMode("edit");
        setActiveMenuId(null);
    };

    const handleCreate = () => {
        setGradingTemplateToEdit(null);
        setModalMode("create");
    };

    const toggleMenu = (id: string) => {
        setActiveMenuId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="w-full">
            <div className="flex items-center mb-5 justify-between">
                <div className="max-w-[250px] w-full">
                    <p className="text-custom-black text-sm font-semibold">Tus porcentajes evaluativos</p>
                    <p className="text-xs text-gray-500">Cada planilla o porcentaje evaluativo puede contener varios criterios.</p>
                </div>
                <button
                    className="cursor-pointer flex items-center gap-1 py-2 px-3 rounded-md transition-colors text-sm font-bold text-primary hover:bg-primary-shadow border-2 border-primary/20"
                    onClick={handleCreate}
                >
                    <HiPlus />
                    <p>Añadir</p>
                </button>
            </div>

            <ul className="flex flex-col gap-1">
                {
                    gradingTemplates.map((gradingTemplate: GradingTemplate) => {
                        const isMenuOpen = activeMenuId === gradingTemplate.id;

                        return (
                            <li
                                key={gradingTemplate.id}
                                className="w-full text-left p-3 sm:px-5 sm:py-3 relative border-2 border-primary-shadow/50 rounded-lg text-sm font-medium text-custom-black hover:bg-primary-shadow/40 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => handleNavigate(gradingTemplate.id)}
                                        className="cursor-pointer capitalize text-sm sm:text-base font-medium"
                                    >
                                        {gradingTemplate.name} <span className="text-xs text-gray-500 font-normal">{`(${gradingTemplate.scale_min}-${gradingTemplate.scale_max})`}</span>
                                    </button>

                                    <button
                                        className="p-2 rounded-md hover:bg-primary-shadow/70 cursor-pointer"
                                        onClick={() => toggleMenu(gradingTemplate.id)}
                                    >
                                        <BsThreeDots />
                                    </button>
                                </div>

                                {isMenuOpen && (
                                    <div
                                        ref={ref}
                                        className="absolute right-5 top-12 border-2 border-gray-100 rounded-xl z-20 bg-white max-w-[130px] w-full shadow-lg"
                                    >
                                        <ul className="flex flex-col text-xs md:text-sm">
                                            <li className="w-full">
                                                <button
                                                    className="cursor-pointer flex items-center justify-start gap-2 rounded-t-xl p-2.5 w-full hover:bg-gray-100 transition-colors text-gray-700"
                                                    onClick={() => handleEdit(gradingTemplate)}
                                                >
                                                    <HiPencil className="text-base" />
                                                    <span>Editar</span>
                                                </button>
                                            </li>
                                            <li className="w-full">
                                                <button
                                                    className="cursor-pointer flex items-center justify-start gap-2 rounded-b-xl p-2.5 w-full hover:bg-red-100 transition-colors text-red-500"
                                                    onClick={() => handleDelete(gradingTemplate)}
                                                >
                                                    <HiTrash className="text-base" />
                                                    <span>Eliminar</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                        );
                    })
                }
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
