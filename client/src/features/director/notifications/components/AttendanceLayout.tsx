import ButtonChevronBack from "../../../../components/ui/buttons/ButtonChevrowBack.tsx";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { usePeriods } from "../../../../shared/hooks/usePeriods.ts";
import { useAttendanceSummary } from "../hooks/useAttendanceSummary.ts";
import type { AttendanceSummary } from "../types";
import {AttendanceList} from "./ui/AttendanceList.tsx";

export function AttendanceLayout() {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

    const { periods } = usePeriods();

    const selectedPeriod = periods?.find(p => p.id === selectedPeriodId) || periods?.[0];

    const { loading, attendance } = useAttendanceSummary({
        startDate: selectedPeriod?.start_date || "",
        endDate: selectedPeriod?.end_date || ""
    });

    const handleToggle = (student: AttendanceSummary, index: number) => {
        if (student.student_id) {
            setOpenIndex(openIndex === index ? null : index);
        }
    };

    const uniqueCourses = useMemo(() => {
        return Array.from(new Set(attendance.map(item => item.course_name))).sort();
    }, [attendance]);

    return (
        <div className="flex flex-col h-full gap-4 md:gap-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center">
                <div className="flex gap-2 items-center">
                    <ButtonChevronBack onClick={() => navigate(-1)}/>
                    <div>
                        <h1 className="text-xl md:text-1xl xl:text-2xl font-bold text-custom-black">Asistencias</h1>
                        <p className="text-gray-400 mt-1 text-sm">Monitorea las inasistencias y llegadas tarde</p>
                    </div>
                </div>
            </div>
            <div className="h-full bg-white rounded-xl p-3 md:p-5 shadow-sm border border-gray-100 no-scrollbar overflow-x-auto">
                <div className="flex flex-col gap-5 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}

                    <div className="w-full self-end lg:w-auto">
                        <div className="w-full lg:w-auto">
                            {/* <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">filtrar Periodo</label> */}
                            <select
                                className="bg-gray-50 w-full text-sm md:text-base appearance-none border border-gray-200 text-custom-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer"
                                value={selectedPeriodId || ""}
                                onChange={(e) => setSelectedPeriodId(e.target.value)}
                            >
                                {periods?.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}

                                {periods?.length === 0 && <option value="">Sin periodos</option>}
                            </select>
                        </div>
                    </div>

                    <AttendanceList
                        attendance={attendance}
                        handleToggle={handleToggle}
                        uniqueCourses={uniqueCourses}
                        openIndex={openIndex}
                        period={selectedPeriod}
                    />
                </div>
            </div>
        </div>
    )
}