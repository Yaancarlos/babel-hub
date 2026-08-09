import { memo } from "react";
import { reverseName } from "../../../../../types";
import type { Student } from "../../types";
import type { AttendanceStatus } from "../../../../types/types";

export const StudentAttendanceRow = memo(function StudentAttendanceRow({
                                                                    student,
                                                                    status,
                                                                    onUpdate
                                                                }:{
    student: Student;
    status: string;
    onUpdate: (id: string, status: AttendanceStatus) => void
}) {
    return (
        <li key={student.student_id} className="p-4 flex flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full uppercase bg-gray-100 text-gray-600 flex items-center justify-center text-xs md:text-sm font-bold shrink-0">
                    {`${student.first_name.charAt(0)}${student.first_last_name.charAt(0)}`}
                </div>
                <span className="font-medium capitalize text-sm md:text-base text-custom-black leading-tight">
                    {reverseName({
                        firstName: student.first_name,
                        middleName: student.middle_name,
                        firstLastName: student.first_last_name,
                        secondLastName: student.second_last_name
                    })}
                </span>
            </div>

            <div className="flex p-1 shrink-0">
                <button
                    onClick={() => onUpdate(student.student_id, 'present')}
                    className={`px-2 py-1.5 rounded-md transition-all`}
                >
                    <span className={`border-2 w-4 h-4 rounded-full block ${status === 'present' ? 'bg-green-600 border-green-600' : 'bg-transparent border-gray-600'}`}></span>
                </button>
                <button
                    onClick={() => onUpdate(student.student_id, 'late')}
                    className={`px-2 py-1.5 rounded-md transition-all}`}
                >
                    <span className={`border-2 w-4 h-4 rounded-full block ${status === 'late' ? 'bg-yellow-400 border-yellow-400' : 'bg-transparent border-gray-600'}`}></span>
                </button>
                <button
                    onClick={() => onUpdate(student.student_id, 'absent')}
                    className={`px-2 py-1.5 rounded-md transition-all'}`}
                >
                    <span className={`border-2 w-4 h-4 rounded-full block ${status === 'absent' ? 'bg-red-600 border-red-600' : 'bg-transparent border-gray-600'}`}></span>
                </button>
            </div>
        </li>
    )
});