import { LoadingContent } from "../../../../../../components/ui/Loadings.tsx";
import { formatDate, reverseName } from "../../../../../../types";
import {usePeriodAttendance} from "../../hooks/usePeriodAttendance.ts";
import {usePeriods} from "../../../../../../shared/hooks/usePeriods.ts";
import {useState} from "react";

interface ViewAttendanceProps {
    courseId: string;
    classId: string;
}

export function ViewAttendance({ courseId, classId }: ViewAttendanceProps) {
    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
    const { periods } = usePeriods();
    const selectedPeriod = periods?.find(period => period.id === selectedPeriodId) ?? periods?.[0];

    const { loading, calendarDates, periodAttendance } = usePeriodAttendance({
        courseId,
        classId,
        startDate: selectedPeriod?.start_date || "",
        endDate: selectedPeriod?.end_date || ""
    })

    if (!selectedPeriod) return <div>No hay periodos disponibles</div>;

    return (
        <div className="max-w-4xl mx-auto">
            {loading ? (
                <div className="p-5">
                    <LoadingContent title="Cargando asistencia..." />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="w-full bg-white rounded-xl border border-gray-100 flex justify-end items-center p-2 lg:p-4">
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

                    <div className="overflow-x-auto bg-white rounded-xl border border-gray-100">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                            <tr className="bg-gray-50 text-gray-600 text-[10px] uppercase tracking-wider">
                                <th className="sticky left-0 bg-gray-50 p-4 border-b border-r border-gray-100 z-20 font-bold min-w-[200px]">
                                    Estudiante
                                </th>
                                {calendarDates.map(date => {
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
                            {
                                periodAttendance.length > 0 ? (
                                    periodAttendance.map((student) => {
                                        const formattedName = reverseName({
                                            firstLastName: student.firstLastName,
                                            firstName: student.firstName,
                                            middleName: student.middleName,
                                            secondLastName: student.secondLastName
                                        })

                                        return (
                                            <tr key={student.student_id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="sticky left-0 bg-white p-4 border-r border-gray-100 z-10">
                                                    <div className="truncate max-w-[200px] font-medium capitalize text-custom-black text-sm" title={formattedName}>
                                                        {formattedName}
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
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={calendarDates.length > 0 ? calendarDates.length + 1 : 2} className="p-5 md:p-10 text-center text-sm md:text-base text-gray-500">
                                            {
                                                (selectedPeriod?.start_date && new Date() < new Date(selectedPeriod.start_date))
                                                    ? "Este periodo aún no ha comenzado."
                                                    : "No hay datos de asistencia para este periodo."
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </div>
    )
}