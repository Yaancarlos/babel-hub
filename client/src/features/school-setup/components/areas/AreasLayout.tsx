import { useNavigate } from "react-router-dom";
import { DeleteButton, EditButton } from "../../../../components/ui/buttons/Buttons.tsx";
import { useAreas } from "../../../../shared/hooks/useAreas.ts";
import { useDeleteArea } from "../../hooks/areas/useDeleteArea.ts";
import { useCallback, useState } from "react";
import type { AreaProps } from "../../types";
import { ConfirmModal } from "../../../../components/ui/modals/ConfirmModal.tsx";
import type { ModalModeTypes } from "../../../../types";
import { AreasFormModal } from "../ui/AreasFormModal.tsx";

export function AreasLayout() {
    const navigate = useNavigate();
    const [areaToDelete, setAreaToDelete] = useState<AreaProps | null>(null);
    const [areaToEdit, setAreaToEdit] = useState<AreaProps | undefined>(undefined);
    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');

    const { areas, reloadAreas } = useAreas();
    const { loadingDelete, deleteAreaById } = useDeleteArea(reloadAreas);

    const handleNavigate = useCallback((url: any) => {
        navigate(`areas/${url}`);
    }, [navigate]);

    const handleEdit = useCallback((area: AreaProps) => {
        setAreaToEdit(area);
        setModalMode('edit');
    }, []);

    const handleDelete = useCallback((area: AreaProps) => {
        setAreaToDelete(area);
    }, []);

    const handleCreate = () => {
        setAreaToEdit(undefined);
        setModalMode("create");
    }

    return (
        <div className="f-full">
            <ul className="flex flex-col gap-1">
                {areas.map(area => (
                    <li
                        key={area.id}
                        className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-custom-black hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => handleNavigate(area.id)}
                                className="cursor-pointer capitalize py-2 px-3 text-sm font-medium"
                            >
                                {area.name}
                            </button>
                            <div className="flex gap-2">
                                <EditButton onClick={() => handleEdit(area)} />
                                <DeleteButton onClick={() => handleDelete(area)} />
                            </div>
                        </div>
                    </li>
                ))}
                <li className="flex items-center justify-end">
                    <button
                        className="cursor-pointer py-2 px-3 rounded-xl transition-colors text-sm font-bold text-primary hover:text-white hover:bg-primary"
                        onClick={handleCreate}
                    >
                        Añadir nueva área
                    </button>
                </li>
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
    )
}