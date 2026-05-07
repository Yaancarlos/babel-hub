import { memo } from "react";
import { formateDate, getInitials, reverseName } from "../../../../../types";
import { DeleteButton, EditButton } from "../../../../../components/ui/buttons/Buttons.tsx";
import type { StudentRowProps } from "../../types";

export const StudentsRows = memo(function ({ student, onEdit, onDelete, onNavigate }: StudentRowProps){
    return (
        <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary-shadow flex items-center justify-center text-primary font-bold text-sm">
                        {getInitials(student.full_name)}
                    </div>
                    <button
                        onClick={() => onNavigate(`${student.student_id}`)}
                        className="overflow-hidden text-sm xl:text-base text-left cursor-pointer"
                    >
                        <p className="font-bold capitalize text-custom-black truncate" title={student.full_name}>
                            {reverseName(student.full_name)}
                        </p>
                        <p className="text-gray-500 text-xs truncate" title={student.email}>
                            {student.email}
                        </p>
                    </button>
                </div>
            </td>

            <td className="p-4">
                {student.enrollment_code ? (
                    <span className="bg-green-100 text-green-700 font-semibold px-2 py-1 rounded text-xs">
                        {student.enrollment_code}
                    </span>
                ) : (
                    <span className="bg-yellow-100 text-yellow-700 font-semibold px-2 py-1 rounded text-xs">
                        Pendiente
                    </span>
                )}
            </td>

            <td className="p-4 font-medium text-sm xl:text-base text-gray-700">
                {student.course_name}
            </td>

            <td className="p-4 text-gray-500 text-xs xl:text-sm">
                {formateDate(student.created_at)}
            </td>

            <td className="md:p-4 pr-3 text-right space-x-1 xl:space-x-3">
                <EditButton onClick={() => onEdit(student)} />
                <DeleteButton onClick={() => onDelete(student.student_id)} />
            </td>
        </tr>
    );
});