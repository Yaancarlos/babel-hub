import { useNavigate } from "react-router-dom";
import { useAreas } from "../../../../../shared/hooks/useAreas.ts";
import { useDeleteArea } from "../../hooks/areas/useDeleteArea.ts";
import { useEffect, useRef, useState } from "react";
import type { AreaProps } from "../../types";
import { ConfirmModal } from "../../../../../components/ui/modals/ConfirmModal.tsx";
import type { ModalModeTypes } from "../../../../../types";
import { AreasFormModal } from "../ui/AreasFormModal.tsx";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";

export function AreasLayout() {
    const navigate = useNavigate();
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const [areaToDelete, setAreaToDelete] = useState<AreaProps | null>(null);
    const [areaToEdit, setAreaToEdit] = useState<AreaProps | undefined>(undefined);
    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');

    const { areas, reloadAreas } = useAreas();
    const { loadingDelete, deleteAreaById } = useDeleteArea(reloadAreas);

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

    const handleNavigate = (url: string) => {
        navigate(`areas/${url}`);
    };

    const handleEdit = (area: AreaProps) => {
        setAreaToEdit(area);
        setModalMode('edit');
        setActiveMenuId(null);
    };

    const handleDelete = (area: AreaProps) => {
        setAreaToDelete(area);
        setActiveMenuId(null);
    };

    const handleCreate = () => {
        setAreaToEdit(undefined);
        setModalMode("create");
    };

    const toggleMenu = (id: string) => {
        setActiveMenuId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="w-full">
            <div className="flex items-center mb-5 justify-between">
                <div className="max-w-[250px] w-full">
                    <p className="text-custom-black text-sm font-semibold">Tus áreas académicas</p>
                    <p className="text-xs text-gray-500">Cada área puede contener varias asignaturas.</p>
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
                {areas.map((area) => {
                    const isMenuOpen = activeMenuId === area.id;

                    return (
                        <li
                            key={area.id}
                            className="w-full text-left p-3 sm:px-5 sm:py-3 relative border-2 border-primary-shadow/50 rounded-lg text-sm font-medium text-custom-black hover:bg-primary-shadow/40 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => handleNavigate(area.id)}
                                    className="cursor-pointer capitalize text-sm sm:text-base font-medium"
                                >
                                    {area.name}
                                </button>

                                <button
                                    className="p-2 rounded-md hover:bg-primary-shadow/70 cursor-pointer"
                                    onClick={() => toggleMenu(area.id)}
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
                                                onClick={() => handleEdit(area)}
                                            >
                                                <HiPencil className="text-base" />
                                                <span>Editar</span>
                                            </button>
                                        </li>
                                        <li className="w-full">
                                            <button
                                                className="cursor-pointer flex items-center justify-start gap-2 rounded-b-xl p-2.5 w-full hover:bg-red-50 transition-colors text-red-500"
                                                onClick={() => handleDelete(area)}
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
                })}
            </ul>

            <ConfirmModal
                isOpen={areaToDelete !== null}
                onClose={() => setAreaToDelete(null)}
                title="¿Estás seguro?"
                message={`¿Quieres eliminar la area ${areaToDelete?.name}?`}
                onConfirm={async () => {
                    if (areaToDelete) {
                        await deleteAreaById(areaToDelete.id);
                        setAreaToDelete(null);
                    }
                }}
                loadingDelete={loadingDelete}
            />

            {modalMode !== 'none' && (
                <AreasFormModal
                    mode={modalMode}
                    onSuccess={async () => {
                        setAreaToEdit(undefined);
                        await reloadAreas();
                        setModalMode('none');
                    }}
                    area={areaToEdit}
                    onClose={() => {
                        setAreaToEdit(undefined);
                        setModalMode('none');
                    }}
                />
            )}
        </div>
    );
}
