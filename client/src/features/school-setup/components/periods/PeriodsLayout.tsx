import { DeleteButton, EditButton } from "../../../../components/ui/buttons/Buttons.tsx";
import { usePeriods } from "../../../../shared/hooks/usePeriods.ts";
import { useCallback, useState } from "react";
import type { ModalModeTypes } from "../../../../types";
import { ConfirmModal } from "../../../../components/ui/modals/ConfirmModal.tsx";
import type { PeriodProps } from "../../types";
import { useDeletePeriod } from "../../hooks/periods/useDeletePeriod.ts";
import { PeriodsFormModal } from "../ui/PeriodsFormModal.tsx";

export function PeriodsLayout() {
    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');
    const [periodToDelete, setPeriodToDelete] = useState<PeriodProps | null>(null);
    const [periodToEdit, setPeriodToEdit] = useState<PeriodProps | undefined>(undefined);

    const { periods, reloadPeriods } = usePeriods();
    const { loadingDelete, deletePeriodById } = useDeletePeriod(reloadPeriods);

    const handleCreatePeriod = () => {
        setModalMode('create');
    }

    const handleEditPeriod = useCallback((period: any) => {
        setPeriodToEdit(period);
        setModalMode('edit');
    }, [])

    const handleDeletePeriod = useCallback((period: any) => {
        setPeriodToDelete(period);
    }, [])

    return (
        <div className="w-full">
            <ul className="flex flex-col gap-1">
                {periods.map(period => (
                    <li
                        key={period.id}
                        className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-custom-black hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <p className="capitalize text-xs md:text-sm">{period.name} <span className="text-gray-500 text-xs font-normal ml-2">({period.start_date.split('T')[0]} - {period.end_date.split('T')[0]})</span></p>
                            <div className="flex gap-2">
                                <EditButton onClick={() => handleEditPeriod(period)} />
                                <DeleteButton onClick={() => handleDeletePeriod(period)} />
                            </div>
                        </div>
                    </li>
                ))}
                <li className="flex items-center justify-end w-full">
                    <button
                        className="cursor-pointer py-2 px-3 text-sm font-bold text-primary hover:text-white hover:bg-primary rounded-xl transition-colors"
                        onClick={handleCreatePeriod}
                    >
                        Añadir nuevo periodo académico
                    </button>
                </li>
            </ul>

            <ConfirmModal
                isOpen={periodToDelete !== null}
                onClose={() => setPeriodToDelete(null)}
                title="¿Estás seguro?"
                message={`¿Quieres eliminar la clase de ${periodToDelete?.name}?`}
                onConfirm={async () => {
                    if (periodToDelete) {
                        await deletePeriodById(periodToDelete.id);
                        setPeriodToDelete(null);
                    }
                }}
                loadingDelete={loadingDelete}
            />

            {modalMode !== 'none' && (
                <PeriodsFormModal
                    mode={modalMode}
                    onSuccess={async () => {
                        setPeriodToEdit(undefined);
                        await reloadPeriods();
                        setModalMode('none');
                    }}
                    period={periodToEdit}
                    onClose={() => {
                        setPeriodToEdit(undefined);
                        setModalMode('none');
                    }}
                />
            )}
        </div>
    )
}