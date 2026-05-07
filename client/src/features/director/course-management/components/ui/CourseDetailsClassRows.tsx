import {memo} from "react";
import {HiDotsVertical} from "react-icons/hi";
import type { ClassItem } from "../../types";

interface ClassRowProps {
    cls: ClassItem;
    index: number;
    totalRecords: number;
    isOpen: boolean;
    onNavigate: (id: string) => void;
    onToggleMenu: (id: string) => void;
    onEdit: (cls: ClassItem) => void;
    onDelete: (cls: ClassItem) => void;
}

export const CourseDetailsClassRows = memo(function ClassRowItem({
                                                    cls,
                                                    index,
                                                    totalRecords,
                                                    isOpen,
                                                    onNavigate,
                                                    onToggleMenu,
                                                    onEdit,
                                                    onDelete
                                                }: ClassRowProps) {
    const isLast = index === totalRecords - 1;

    return (
        <li className="flex w-full group relative p-3 items-center justify-between">
            <button
                onClick={() => onNavigate(cls.class_id)}
                className="cursor-pointer flex justify-between items-center transition-colors w-full"
            >
                <div className="text-left">
                    <p className="font-medium text-custom-black">{cls.subject_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Prof: {cls.teacher_name}</p>
                </div>
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleMenu(cls.class_id);
                }}
                className="cursor-pointer p-1.5 text-gray-500 text-base opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity md:text-lg rounded-full"
            >
                <HiDotsVertical/>
            </button>
            {isOpen && (
                <ul className={`absolute ${isLast ? "bottom-5" : "top-5"} right-10 z-50 w-32 h-fit p-2 text-sm md:text-base font-semibold bg-white text-custom-black shadow-lg border border-gray-100 rounded-xl`}>
                    <li>
                        <button onClick={() => onEdit(cls)} className="p-2 w-full text-left cursor-pointer hover:bg-gray-100 rounded-xl">
                            Editar
                        </button>
                    </li>
                    <hr className="border border-gray-100 rounded-xl my-1"/>
                    <li>
                        <button onClick={() => onDelete(cls)} className="p-2 w-full text-left cursor-pointer hover:bg-red-shadow text-red-error rounded-xl">
                            Eliminar
                        </button>
                    </li>
                </ul>
            )}
        </li>
    );
});