import React from "react";
import ButtonChevronBack from "../../../../../components/ui/buttons/ButtonChevrowBack.tsx";
import { HiOutlineCalendar, HiOutlineClipboardList, HiOutlineDocumentText, HiOutlineUsers } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import type { ClassDetailsData } from "../../types";
import type { TabTypes } from "../../../../types/types.ts";
import { reverseName } from "../../../../../types";

interface ClassLayout {
    children: React.ReactNode;
    data: ClassDetailsData;
    activeTab: TabTypes;
    onTabChange: (tab: TabTypes) => void;
}

export function ClassLayout({ children, data, activeTab, onTabChange }: ClassLayout) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex flex-col gap-4">
                <div className="flex flex-col pt-5 px-5 md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex gap-4 items-center">
                        <ButtonChevronBack onClick={() => navigate(-1)} />
                        <div>
                            <h1 className="text-xl md:text-1xl xl:text-2xl capitalize font-bold text-custom-black">
                                {data.details.subject_name}
                                <span className="text-gray-400 font-normal ml-2">| {data.details.course_name}</span>
                            </h1>
                            <p className="text-gray-500 mt-1 text-xs md:text-sm">
                                Profesor: <span className="font-medium capitalize text-gray-700">
                                {
                                    reverseName({
                                        middleName: data.details.teacher_middle_name,
                                        secondLastName: data.details.teacher_second_last_name,
                                        firstName: data.details.teacher_first_name,
                                        firstLastName: data.details.teacher_first_last_name
                                    })
                                }
                            </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex overflow-x-auto bg-white w-full no-scrollbar">
                    <button
                        onClick={() => onTabChange('students')}
                        className={`flex-1 text-sm md:text-base cursor-pointer min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 font-medium border-b-2 border-transparent transition-all ${activeTab === 'students' ? 'text-primary border-b-primary border-b-2' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <HiOutlineUsers className="text-lg" /> Estudiantes
                    </button>
                    <button
                        onClick={() => onTabChange('register attendance')}
                        className={`flex-1 text-sm md:text-base cursor-pointer min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 font-medium border-b-2 border-transparent transition-all ${activeTab === 'register attendance' ? 'text-primary border-b-primary border-b-2' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <HiOutlineClipboardList className="text-lg" /> Tomar Asistencia
                    </button>
                    <button
                        onClick={() => onTabChange('see attendance')}
                        className={`flex-1 text-sm md:text-base cursor-pointer min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 font-medium border-b-2 border-transparent transition-all ${activeTab === 'see attendance' ? 'text-primary border-b-primary border-b-2' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <HiOutlineCalendar className="text-lg" /> Ver Asistencia
                    </button>
                    <button
                        onClick={() => onTabChange('assignments')}
                        className={`flex-1 text-sm md:text-base cursor-pointer min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 font-medium border-b-2 border-transparent transition-all ${activeTab === 'assignments' ? 'text-primary border-b-primary border-b-2' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <HiOutlineDocumentText className="text-lg" /> Calificaciones
                    </button>
                </div>
            </div>
            <div className="p-3 lg:p-4 xl:p-5 flex-1 styled-scrollbar overflow-y-auto">
                {children}
            </div>
        </div>
    )
}