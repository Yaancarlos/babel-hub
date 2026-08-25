import type { ClassItem } from "../../types";
import { CourseDetailsClassRows } from "../ui/CourseDetailsClassRows.tsx";
import { memo } from "react";

interface ClassListProps {
    classes: ClassItem[];
    onEdit: (cls: ClassItem) => void;
    onDelete: (cls: ClassItem) => void;
    onNavigate: (id: string) => void;
    onClassOptions: (id: string) => void;
    classOption: string | null;
}

export const ClassList = memo(function ClassList({
                                                     classes,
                                                     onNavigate,
                                                     onEdit,
                                                     onDelete,
                                                     classOption,
                                                     onClassOptions
                                                 }: ClassListProps) {
    return (
        <div className="absolute right-5 top-full w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-30 overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-700">Clases Asignadas</h3>
            </div>

            <ul className="divide-y w-full divide-gray-100 max-h-[300px] overflow-y-auto">
                {classes.map((cls, index, records) => (
                    <CourseDetailsClassRows
                        key={cls.class_id}
                        cls={cls}
                        index={index}
                        totalRecords={records.length}
                        isOpen={classOption === cls.class_id}
                        onNavigate={onNavigate}
                        onToggleMenu={onClassOptions}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
                {classes.length === 0 && (
                    <p className="text-gray-500 text-center py-6 text-sm">No hay clases asignadas a este curso</p>
                )}
            </ul>
        </div>
    );
});