import { Fragment, useMemo } from "react";
import { useState } from "react";
import { getInitials, reverseName } from "../../../../types";
import StudentCalendarCard from "./ui/StudentCalendarCard.tsx";
import { useAttendanceSummary } from "../hooks/useAttendanceSummary.ts";
import type { AttendanceSummary } from "../types";
import { usePeriods } from "../../../../shared/hooks/usePeriods.ts";
import { NoResults } from "../../../../components/ui/blocks/NoResults.tsx";

export function AttendanceList() {
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

            {
                attendance.length > 0 ? (
                    uniqueCourses.map((course) => (
                        <div key={course} className="mb-8">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 px-1">
                                    <div className="w-1 h-6 rounded-full bg-primary" />
                                    <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
                                            {course}
                                        </span>
                                </div>

                                {attendance.map((student, index) => {
                                    const absences = Number(student.total_absences);
                                    const lates = Number(student.total_lates);
                                    const isOpen = openIndex === index;

                                    return (
                                        student.course_name === course && (
                                            <Fragment key={student.student_id}>
                                                <button
                                                    onClick={() => handleToggle(student, index)}
                                                    className={`group py-3 px-4 cursor-pointer transition-all duration-200 w-full border flex items-center justify-between rounded-2xl
                                                    ${isOpen ?
                                                        (absences > 0 && absences % 2 === 0) ? 'border-red-error shadow-md' : 'border-primary shadow-md' :
                                                        (absences > 0 && absences % 2 === 0) ? 'border-red-error hover:shadow-sm' : 'border-gray-100 bg-white hover:border-primary hover:shadow-sm'
                                                    }`}

                                                >
                                                    <div className="flex items-center min-w-0 gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                                                                ${isOpen ?
                                                            (absences >= 2) ? 'bg-red-error text-white' : 'bg-primary text-white' :
                                                            (absences >= 2) ? 'bg-red-shadow text-red-error' : 'bg-primary-shadow text-primary'
                                                        }`}>
                                                            {getInitials(student.student_name)}
                                                        </div>
                                                        <p className={`text-sm md:text-base leading-tight max-w-40 sm:max-w-full text-left capitalize font-semibold transition-colors 
                                                                ${isOpen ?
                                                            absences >= 2 ? 'text-gray-900' : 'text-gray-900' :
                                                            absences >= 2 ?  'text-gray-700 group-hover:text-red-error' :  'text-gray-700 group-hover:text-primary'
                                                        }`}>
                                                            {reverseName(student.student_name)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col items-end">
                                                                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${lates > 0 ? 'bg-yellow-50 text-yellow-600' : 'text-gray-300'}`}>
                                                                    {lates}
                                                                </span>
                                                        </div>

                                                        <div className="flex flex-col items-end border-l pl-4 border-gray-100">
                                                                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                                                                    absences > 0 ? 'bg-red-50 text-red-500' : 'text-gray-300'
                                                                }`}>
                                                                    {absences}
                                                                </span>
                                                        </div>
                                                    </div>
                                                </button>

                                                {isOpen && selectedPeriod && (
                                                    <div className="p-1 rounded-xl bg-primary-shadow/30 ring-1 ring-primary/20">
                                                        <div className="bg-white rounded-xl shadow-inner">
                                                            <StudentCalendarCard
                                                                studentId={student.student_id}
                                                                period={selectedPeriod}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </Fragment>
                                        )
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (<NoResults title="No hay resultados de asistencia"/>)
            }
        </div>
    )
}