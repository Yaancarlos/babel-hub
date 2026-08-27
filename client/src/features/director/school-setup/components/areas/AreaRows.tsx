import {HiPencil, HiTrash} from "react-icons/hi";
import type {AreaProps} from "../../types";
import {ActionMenu, type MenuOption} from "../../../../../components/ui/menu/ActionMenu.tsx";

interface AreaRowsProps {
    area: AreaProps;
    onDelete: (area: AreaProps) => void;
    onEdit: (area: AreaProps) => void;
    navigate: (id: string) => void;
}

export function AreaRows({ area, onDelete, onEdit, navigate }: AreaRowsProps) {
    const menuOptions: MenuOption[] = [
        {
            label: "Editar",
            icon: <HiPencil className="size-4" />,
            onClick: () => onEdit(area),
        },
        {
            isSeparator: true,
            label: "separator"
        },
        {
            label: "Eliminar",
            icon: <HiTrash className="size-4" />,
            onClick: () => onDelete(area),
            isDanger: true,
        }
    ];

    return (
        <li className="w-full p-3 sm:px-5 sm:py-3 border-2 border-gray-100 rounded-xl text-sm font-medium text-custom-black flex items-center justify-between">
            <button
                onClick={() => navigate(area.id)}
                className="cursor-pointer capitalize text-sm sm:text-base font-medium"
            >
                {area.name}
            </button>

            <ActionMenu options={menuOptions} />
        </li>
    )
}