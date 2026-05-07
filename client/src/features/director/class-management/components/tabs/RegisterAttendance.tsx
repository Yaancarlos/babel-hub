import {LoadingContent} from "../../../../../components/ui/Loadings.tsx";
import type { ClassDetailsData } from "../../types";
import { StudentAttendanceRow } from "../ui/StudentAttendaceRow.tsx";
import {useTakeAttendance} from "../../hooks/useTakeAttendance.ts";
import {NoResults} from "../../../../../components/ui/blocks/NoResults.tsx";
import {PrimaryButton} from "../../../../../components/ui/buttons/Buttons.tsx";


interface RegisterAttendanceProps {
    classData: ClassDetailsData
    date: string;
}

export function RegisterAttendance ({ classData, date }: RegisterAttendanceProps) {
    const {
        attendanceDate,
        setAttendanceDate,
        saving,
        records,
        loading,
        saveRecords,
        updateRecords
    } = useTakeAttendance({
        classId: classData.details.id,
        date,
        students: classData.students,
    });


    return (
        <div className="max-w-4xl w-full mx-auto space-y-4">
            <div className="bg-white p-2 lg:p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
{/*
                    <span className="font-medium text-gray-700">Fecha de asistencia:</span>
*/}
                    <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                    />
                </div>
                <PrimaryButton type="button" onClick={saveRecords} title={saving ? "Guardando" : "Registrar Asistencia"} />
            </div>

            {loading ? (
                <LoadingContent title="Cargando..." />
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {
                        classData?.students.length > 0 ? (
                            <ul className="divide-y divide-gray-50">
                                {classData?.students.map((student) => {
                                    const status = records[student.student_id] || 'present';

                                    return (
                                        <StudentAttendanceRow
                                            key={student.student_id}
                                            student={student}
                                            status={status}
                                            onUpdate={updateRecords}
                                        />
                                    );
                                })}
                            </ul>
                        ) : (<NoResults title="No hay estudiantes en este curso" />)
                    }
                </div>
            )}
        </div>
    );
}