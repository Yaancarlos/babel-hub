import { LoadingContent } from "../../../../components/ui/Loadings.tsx";
import { formatDate, reverseName } from "../../../../types";
import { NoResults } from "../../../../components/ui/blocks/NoResults.tsx";
import { useAttendanceGrid } from "../../hooks/useAttendanceGrid.ts";
import type { ClassDetailsData } from "../../types";
import { useState } from "react";
import { usePeriods } from "../../../../shared/hooks/usePeriods.ts";

interface ViewAttendanceProps {
    classData: ClassDetailsData;
    courseId: string;
}

export function ViewAttendance({ classData, courseId }: ViewAttendanceProps) {
    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
    const { periods } = usePeriods();
    const selectedPeriod = periods?.find(period => period.id === selectedPeriodId) ?? periods?.[0];

    const { loading, calendar, attendance } = useAttendanceGrid({
        courseId,
        classId: classData.details.id,
        startDate: selectedPeriod?.start_date || "",
        endDate: selectedPeriod?.end_date || ""
    });

    if (!selectedPeriod) return <div>No hay periodos disponibles</div>;

    return (
        <div className="bg-white rounded-xl border border-gray-100 max-w-4xl w-full mx-auto overflow-hidden shadow-sm">
            {loading ? (
                <div className="p-5">
                    <LoadingContent title="Cargando asistencia..." />
                </div>
            ) : (
                <div>
                    <div className="w-full flex justify-end items-center p-2 lg:p-4">
                        <select
                            className="bg-gray-50 self-end text-sm md:text-base appearance-none border border-gray-200 text-custom-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer"
                            value={selectedPeriod?.id || ""}
                            onChange={(e) => setSelectedPeriodId(e.target.value)}
                        >
                            {periods?.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                            <tr className="bg-gray-50 text-gray-600 text-[10px] uppercase tracking-wider">
                                <th className="bg-gray-50 sticky left-0  p-4 border-b border-r border-gray-100 z-10 font-bold min-w-[200px]">
                                    Estudiantes
                                </th>
                                {calendar.map(date => {
                                    const { dayNum, month, weekday } = formatDate(date);

                                    return (
                                        <th key={date} className="p-1 border-b border-gray-100 text-center font-semibold w-8">
                                            <div className="text-[10px] flex flex-col items-center font-medium text-gray-400">
                                                <span>{dayNum}</span>
                                                <span className="text-custom-black -my-1">{month}</span>
                                                <span>{weekday}</span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {attendance.map((student) => (
                                <tr key={student.student_id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="sticky left-0 bg-white p-4 border-r border-gray-100 z-10">
                                        <div className="truncate max-w-[200px] capitalize font-medium text-custom-black text-sm" title={reverseName(student.name)}>
                                            {reverseName(student.name)}
                                        </div>
                                    </td>

                                    {student.records.map((record: any, idx: number) => {

                                        let bg = "bg-gray-100";
                                        if (record.status === 'present') bg = "bg-green-500 shadow-sm";
                                        if (record.status === 'absent') bg = "bg-red-500 shadow-sm";
                                        if (record.status === 'late') bg = "bg-yellow-300 shadow-sm";

                                        return (
                                            <td key={idx} className="p-2 text-center border-r border-gray-50 last:border-0">
                                                <div className={`w-3.5 h-3.5 mx-auto rounded-full ${bg}`} title={`${record.date.split('T')[0]}: ${record.status}`}></div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {attendance.length === 0 && (
                                <tr>
                                    <td colSpan={calendar.length > 0 ? calendar.length + 1 : 2}>
                                        {   //@ts-ignore
                                            new Date() < new Date(selectedPeriod.start_date)
                                                ? (<NoResults title="Este periodo aún no ha comenzado" />) : (<NoResults title="No hay datos de asistencia para este periodo" />)
                                        }
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}