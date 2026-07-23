import { Fragment } from "react";
import { reverseName } from "../../../../../types";
import { NoResults } from "../../../../../components/ui/blocks/NoResults.tsx";
import type { AttendanceSummary, Period } from "../../types";
import StudentCalendarCardComponent from "./StudentCalendarCard.tsx";

interface AttendanceListProps {
    attendance: AttendanceSummary[];
    handleToggle: (student: AttendanceSummary, index: number) => void;
    uniqueCourses: any[];
    openIndex: number | null;
    period: Period;
}

export function AttendanceList({ attendance, handleToggle, uniqueCourses, openIndex, period }: AttendanceListProps) {
    return (
        <div>
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
                                                            (absences > 0 && absences % 2 === 0) ? 'bg-red-error text-white' : 'bg-primary text-white' :
                                                            (absences > 0 && absences % 2 === 0) ? 'bg-red-shadow text-red-error' : 'bg-primary-shadow text-primary'
                                                        }`}>
                                                            {`${student.student_first_name.charAt(0)}${student.student_first_last_name.charAt(0)}}`}
                                                        </div>
                                                        <p className={`text-sm md:text-base leading-tight max-w-40 sm:max-w-full text-left capitalize font-semibold transition-colors 
                                                                ${isOpen ?
                                                            (absences > 0 && absences % 2 === 0) ? 'text-gray-900' : 'text-gray-900' :
                                                            (absences > 0 && absences % 2 === 0) ?  'text-gray-700 group-hover:text-red-error' :  'text-gray-700 group-hover:text-primary'
                                                        }`}>
                                                            {
                                                                reverseName({
                                                                    middleName: student.student_middle_name,
                                                                    secondLastName: student.student_second_last_name,
                                                                    firstName: student.student_first_name,
                                                                    firstLastName: student.student_first_last_name
                                                                })
                                                            }
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

                                                {isOpen && period && (
                                                    <div className="p-1 rounded-xl border border-gray-100">
                                                        <div className="bg-white rounded-xl shadow-inner">
                                                            <StudentCalendarCardComponent
                                                                studentId={student.student_id}
                                                                period={period}
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