import ButtonChevronBack from "../../../../../components/ui/buttons/ButtonChevrowBack.tsx";
import { reverseName } from "../../../../../types";
import { HiOutlineCalendar, HiOutlineClipboardList } from "react-icons/hi";
import React from "react";
import { useNavigate } from "react-router-dom";
import type { CumulativeGPATypes, ParentStudent } from "../../types/types.ts";
import {LuClipboardPenLine} from "react-icons/lu";

interface CumulativeGPALayoutProps {
    children: React.ReactNode;
    student: ParentStudent[];
    activeTab: CumulativeGPATypes;
    onButtonChange: (tab: CumulativeGPATypes) => void;

    periods: any[];
    selectedPeriodId: string;
    onPeriodChange: (id: string) => void;
}

export function CumulativeGPALayout({
                                        children,
                                        student,
                                        activeTab,
                                        onButtonChange,
                                        periods,
                                        selectedPeriodId,
                                        onPeriodChange
                                    }: CumulativeGPALayoutProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full border border-gray-100 rounded-xl w-full bg-gray-50">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 rounded-t-xl flex flex-col gap-4">
                <div className="flex flex-col pt-5 px-5 md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center w-full justify-between">
                        <div className="flex gap-4 items-center">
                            <ButtonChevronBack onClick={() => navigate(-1)} />
                            <div>
                                <h1 className="text-xl md:text-1xl xl:text-2xl capitalize font-bold text-custom-black">
                                    Acumulado
                                </h1>
                                <p className="text-gray-500 mt-1 text-xs md:text-sm">
                                    Estudiante: <span className="font-medium capitalize text-gray-700">
                                {
                                    reverseName({
                                        middleName: student[0].student_middle_name,
                                        secondLastName: student[0].student_second_last_name,
                                        firstName: student[0].student_first_name,
                                        firstLastName: student[0].student_first_last_name
                                    })
                                }
                            </span>
                                </p>
                            </div>
                        </div>

                        <div className="self-end sm:self-auto">
                            <select
                                className="bg-white text-sm capitalize appearance-none text-custom-black border border-gray-200 rounded-xl md:px-4 p-2 md:py-2.5 focus:outline-none focus:ring-1 focus:ring-primary font-semibold cursor-pointer"
                                value={selectedPeriodId}
                                onChange={(e) => onPeriodChange(e.target.value)}
                            >
                                {periods?.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-3 bg-white w-full p-2">
                    <button
                        onClick={() => onButtonChange('attendance')}
                        className={`text-sm cursor-pointer flex items-center justify-center gap-2 py-2 px-4 font-medium rounded-lg transition-all ${
                            activeTab === 'attendance'
                                ? 'bg-primary text-white hover:bg-primary-darker'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-250'
                        }`}
                    >
                        <HiOutlineClipboardList className="size-4" />
                        Asistencia
                    </button>

                    <button
                        onClick={() => onButtonChange('grades')}
                        className={`text-sm cursor-pointer flex items-center justify-center gap-2 py-2 px-4 font-medium rounded-lg transition-all ${
                            activeTab === 'grades'
                                ? 'bg-primary text-white hover:bg-primary-darker'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-250'
                        }`}
                    >
                        <LuClipboardPenLine className="size-4" />
                        Calificaciones
                    </button>

                    <button
                        onClick={() => onButtonChange('observations')}
                        className={`text-sm cursor-pointer flex items-center justify-center gap-2 py-2 px-4 font-medium rounded-lg transition-all ${
                            activeTab === 'observations'
                                ? 'bg-primary text-white hover:bg-primary-darker'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-250'
                        }`}
                    >
                        <HiOutlineCalendar className="text-lg" />
                        Observaciones
                    </button>
                </div>

            </div>
            <div className="p-2">
                {children}
            </div>
        </div>
    )
}