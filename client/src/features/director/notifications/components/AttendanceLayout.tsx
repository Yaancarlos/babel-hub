import ButtonChevronBack from "../../../../components/ui/buttons/ButtonChevrowBack.tsx";
import { useNavigate } from "react-router-dom";
import {useMemo, useState} from "react";
import { usePeriods } from "../../../../shared/hooks/usePeriods.ts";
import { useAttendanceSummary } from "../hooks/useAttendanceSummary.ts";
import {AttendanceList} from "./ui/AttendanceList.tsx";
import {IoCalendarOutline} from "react-icons/io5";
import {formatDatePeriod} from "../../../../types";
import {LoadingContent} from "../../../../components/ui/Loadings.tsx";

export function AttendanceLayout() {
    const navigate = useNavigate();

    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

    const { periods } = usePeriods();

    const selectedPeriod = periods?.find(p => p.id === selectedPeriodId) || periods?.[0];

    const { loading, attendance } = useAttendanceSummary({
        startDate: selectedPeriod?.start_date || "",
        endDate: selectedPeriod?.end_date || ""
    });

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
                <div className="w-full rounded-xl bg-primary-shadow flex justify-between items-center sm:p-3 p-2 md:p-4">
                    <div className="flex gap-2 items-center">
                        <div className="text-white bg-primary p-2 text-xl rounded-md">
                            <IoCalendarOutline />
                        </div>
                        <div>
                            <p className="text-primary uppercase text-[10px] sm:text-xs font-bold">centro de asistencia</p>
                            <p className="text-custom-black capitalize font-semibold text-xs sm:text-sm">
                                {formatDatePeriod(selectedPeriod.start_date, selectedPeriod.end_date)}
                            </p>
                        </div>
                    </div>
                    <select
                        className="bg-white text-sm capitalize appearance-none text-indigo-600 rounded-xl md:px-4 p-2 md:py-2.5 focus:outline-none focus:ring-1 focus:ring-primary font-semibold cursor-pointer"
                        value={selectedPeriod?.id || ""}
                        onChange={(e) => setSelectedPeriodId(e.target.value)}
                    >
                        {periods?.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col mt-5 gap-5 relative">
                    {loading && (<LoadingContent title="Cargando asistencia" />)}

                    <AttendanceList
                        attendance={attendance}
                        uniqueCourses={uniqueCourses}
                        period={selectedPeriod}
                    />
                </div>
            </div>
        </div>
    )
}