import { PrimaryButton } from "../../../../../components/ui/buttons/Buttons.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingContent } from "../../../../../components/ui/Loadings.tsx";
import { useCourseData } from "../../hooks/course-details/useCourseData.ts";
import { formatterDate, type ModalModeTypes } from "../../../../../types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ClassItem } from "../../types";
import { ClassList } from "./ClassList.tsx";
import { CourseDetailsStudentsTable } from "../ui/CourseDetailsStudentsTable.tsx";
import { ConfirmModal } from "../../../../../components/ui/modals/ConfirmModal.tsx";
import { useDeleteClass } from "../../hooks/course-details/useDeleteClass.ts";
import { CourseDetailsFormModal } from "../ui/CourseDetailsFormModal.tsx";
import toast from "react-hot-toast";

export function CourseDetailsLayout() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) {
        toast.error("No se encontró el ID del curso en la URL");
        return null;
    };

    const date = formatterDate.format(new Date());
    const { loading, course, attendance, refetch } = useCourseData(id, date);
    const { loadingDelete, deleteClassById } = useDeleteClass(refetch);

    const classesDropDown = useRef<HTMLDivElement>(null)
    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');
    const [showClasses, setShowClasses] = useState<boolean>(false);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [classToDelete, setClassToDelete] = useState<ClassItem | null>(null);
    const [classToEdit, setClassToEdit] = useState<ClassItem | null>(null);

    useEffect(() => {
        const handleClassesDropDown = (e: MouseEvent) => {
            if (classesDropDown.current && !classesDropDown.current.contains(e.target as Node)) {
                setShowClasses(false);
                setSelectedClass(null);
            }
        };

        document.addEventListener('mousedown', handleClassesDropDown);
        return () => document.removeEventListener('mousedown', handleClassesDropDown);
    }, []);

    const handleNavigate = useCallback((classId: string) => {
        navigate(`clase/${classId}`);
    }, [navigate]);

    const handleUpdate = useCallback((cls: ClassItem) => {
        setSelectedClass(null);
        setClassToEdit(cls);
        setModalMode("edit");
    }, []);

    const handleDelete = useCallback((cls: ClassItem) => {
        setClassToDelete(cls);
        setSelectedClass(null);
    }, []);

    const handleShowClassOptions = useCallback((classId: string) => {
        setSelectedClass(prev => prev === classId ? null : classId);
    }, []);

    if (loading) return <LoadingContent title="Cargando curso..."/>;
    if (!course) return <div className="p-6 text-gray-500 text-center">No se encontró el curso.</div>;

    return (
        <div className="flex flex-col h-full w-full">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-1xl xl:text-2xl font-bold text-custom-black">
                        Curso: {course.course.name}
                    </h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">Año Lectivo: {course.course.year}</p>
                </div>
                <div className="flex flex-col md:flex-row w-full md:w-auto gap-3 xl:gap-5 items-center">
                    <PrimaryButton onClick={() => setModalMode("create")} title="Asignar asignatura"/>
                    <div className="w-full md:w-auto" ref={classesDropDown}>
                        <PrimaryButton
                            onClick={() => setShowClasses(!showClasses)}
                            title="Ver clases"
                        />
                        {showClasses && (
                            <ClassList
                                classes={course.classes}
                                onNavigate={handleNavigate}
                                onEdit={handleUpdate}
                                onDelete={handleDelete}
                                classOption={selectedClass}
                                onClassOptions={handleShowClassOptions}
                            />
                        )}
                    </div>
                </div>
            </div>

            <CourseDetailsStudentsTable
                students={course.students}
                attendance={attendance}
            />

            <ConfirmModal
                isOpen={classToDelete !== null}
                onClose={() => setClassToDelete(null)}
                title="¿Estás seguro?"
                message={`¿Quieres eliminar la clase de ${classToDelete?.subject_name}?`}
                onConfirm={async () => {
                    if (classToDelete) {
                        await deleteClassById(classToDelete.class_id);
                        setClassToDelete(null);
                    }
                }}
                loadingDelete={loadingDelete}
            />

            {modalMode !== 'none' && (
                <CourseDetailsFormModal
                    id={id}
                    courseName={course.course.name}
                    mode={modalMode}
                    classToEdit={classToEdit}
                    onSuccess={() => {
                        setClassToEdit(null);
                        setModalMode('none');
                        refetch();
                    }}
                    onClose={() => {
                        setClassToEdit(null);
                        setModalMode('none');
                    }}
                />
            )}
        </div>
    )
}