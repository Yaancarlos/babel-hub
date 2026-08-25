import { usePeriods } from "../../../../../shared/hooks/usePeriods.ts";
import { useState, useEffect, useRef } from "react";
import {formatDatePeriod, type ModalModeTypes} from "../../../../../types";
import { ConfirmModal } from "../../../../../components/ui/modals/ConfirmModal.tsx";
import type { PeriodProps } from "../../types";
import { useDeletePeriod } from "../../hooks/periods/useDeletePeriod.ts";
import { PeriodsFormModal } from "../ui/PeriodsFormModal.tsx";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export function PeriodsLayout() {
    const navigate = useNavigate();
    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');
    const [periodToDelete, setPeriodToDelete] = useState<PeriodProps | null>(null);
    const [periodToEdit, setPeriodToEdit] = useState<PeriodProps | undefined>(undefined);

    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const { periods, reloadPeriods } = usePeriods();
    const { loadingDelete, deletePeriodById } = useDeletePeriod(reloadPeriods);

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
        navigate(`periods/${url}`);
    };

    const handleCreatePeriod = () => {
        setModalMode('create');
    };

    const handleEditPeriod = (period: PeriodProps) => {
        setPeriodToEdit(period);
        setModalMode('edit');
        setActiveMenuId(null);
    };

    const handleDeletePeriod = (period: PeriodProps) => {
        setPeriodToDelete(period);
        setActiveMenuId(null);
    };

    const toggleMenu = (id: string) => {
        setActiveMenuId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="w-full">
            <div className="flex items-center mb-5 justify-between">
                <div className="max-w-[250px] w-full">
                    <p className="text-custom-black text-sm font-semibold">Tus periodos academicos</p>
                </div>
                <button
                    className="cursor-pointer flex items-center gap-1 py-2 px-3 rounded-md transition-colors text-sm font-bold text-primary hover:bg-primary-shadow border-2 border-primary/20"
                    onClick={handleCreatePeriod}
                >
                    <HiPlus />
                    <p>Añadir</p>
                </button>
            </div>

            <ul className="flex flex-col gap-1">
                {periods.map((period) => {
                    const isMenuOpen = activeMenuId === period.id;

                    return (
                        <li
                            key={period.id}
                            className="w-full text-left p-3 sm:px-5 sm:py-3 relative border-2 border-primary-shadow/50 rounded-lg text-sm font-medium text-custom-black hover:bg-primary-shadow/40 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => handleNavigate(period.id)}
                                    className="cursor-pointer text-left"
                                >
                                    <p className="capitalize text-sm sm:text-base font-medium">{period.name}</p>
                                    <p className="text-xs text-gray-400">{formatDatePeriod(period.start_date, period.end_date)}</p>
                                </button>

                                <button
                                    className="p-2 rounded-md hover:bg-primary-shadow/70 cursor-pointer"
                                    onClick={() => toggleMenu(period.id)}
                                >
                                    <BsThreeDots />
                                </button>
                            </div>

                            {isMenuOpen && (
                                <div
                                    ref={ref}
                                    className="absolute right-3 top-10 border-2 border-gray-100 rounded-xl z-20 bg-white max-w-[130px] w-full shadow-lg"
                                >
                                    <ul className="flex flex-col text-xs md:text-sm">
                                        <li className="w-full">
                                            <button
                                                className="cursor-pointer flex items-center justify-start gap-2 rounded-t-xl p-2.5 w-full hover:bg-gray-100 transition-colors text-gray-700"
                                                onClick={() => handleEditPeriod(period)}
                                            >
                                                <HiPencil className="text-base" />
                                                <span>Editar</span>
                                            </button>
                                        </li>
                                        <li className="w-full">
                                            <button
                                                className="cursor-pointer flex items-center justify-start gap-2 rounded-b-xl p-2.5 w-full hover:bg-red-100 transition-colors text-red-500"
                                                onClick={() => handleDeletePeriod(period)}
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
    );
}
