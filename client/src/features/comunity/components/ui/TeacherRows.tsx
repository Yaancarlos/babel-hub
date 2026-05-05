import { memo } from "react";
import { formateDate, getInitials, reverseName } from "../../../../types";
import { DeleteButton, EditButton } from "../../../../components/ui/buttons/Buttons.tsx";
import type { TeacherRowProps } from "../../types";

export const TeacherRow = memo(function ({ teacher, onEdit, onDelete, onNavigate }: TeacherRowProps) {
    return (
        <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary-shadow flex items-center justify-center text-primary-darker font-bold text-sm">
                        {getInitials(teacher.full_name)}
                    </div>
                    <button
                        onClick={() => onNavigate(`${teacher.id}`)}
                        className="overflow-hidden text-sm xl:text-base text-left cursor-pointer"
                    >
                        <p className="font-bold capitalize text-custom-black truncate" title={teacher.full_name}>
                            {reverseName(teacher.full_name)}
                        </p>
                        <p className="text-gray-500 text-xs truncate" title={teacher.email}>
                            {teacher.email}
                        </p>
                    </button>
                </div>
            </td>

            <td className="p-4">
                <span className="bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-full text-xs border border-indigo-100">
                    {teacher.total_classes || 0} Clases
                </span>
            </td>

            <td className="p-4 text-gray-500 text-xs xl:text-sm font-medium">
                {formateDate(teacher.created_at)}
            </td>

            <td className="md:p-4 pr-3 text-right space-x-1 xl:space-x-3">
                <EditButton onClick={() => onEdit(teacher)} />
                <DeleteButton onClick={() => onDelete(teacher.id)} />
            </td>
        </tr>
    );
});