import {memo} from "react";
import { HiPencil, HiTrash} from "react-icons/hi";
import type { ClassItem } from "../../types";
import {reverseName} from "../../../../../types";
import {ActionMenu, type MenuOption} from "../../../../../components/ui/menu/ActionMenu.tsx";

interface ClassRowProps {
    cls: ClassItem;
    onNavigate: (id: string) => void;
    onEdit: (cls: ClassItem) => void;
    onDelete: (cls: ClassItem) => void;
}

export const CourseDetailsClassRows = memo(function ClassRowItem({
                                                    cls,
                                                    onNavigate,
                                                    onEdit,
                                                    onDelete
                                                }: ClassRowProps) {
    const menuOptions: MenuOption[] = [
        {
            label: "Editar",
            icon: <HiPencil className="size-4" />,
            onClick: () => onEdit(cls),
        },
        {
            isSeparator: true,
            label: "separator"
        },
        {
            label: "Eliminar",
            icon: <HiTrash className="size-4" />,
            onClick: () => onDelete(cls),
            isDanger: true,
        }
    ];

    return (
        <li className="flex w-full group relative p-3 items-center justify-between">
            <button
                onClick={() => onNavigate(cls.class_id)}
                className="cursor-pointer flex justify-between items-center transition-colors w-full"
            >
                <div className="text-left">
                    <p className="font-medium capitalize text-custom-black">{cls.subject_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Profe: {
                            reverseName({
                                middleName: cls.middle_name,
                                secondLastName: cls.second_last_name,
                                firstName: cls.first_name,
                                firstLastName: cls.first_last_name
                            })
                        }
                    </p>
                </div>
            </button>
            <ActionMenu options={menuOptions} />
        </li>
    );
});