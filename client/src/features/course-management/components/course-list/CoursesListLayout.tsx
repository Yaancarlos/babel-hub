import { PrimaryButton } from "../../../../components/ui/buttons/Buttons.tsx";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { CoursesList } from "./CoursesList.tsx";
import { useCourseData } from "../../hooks/course-list/useCourseData.ts";
import { useDeleteCourse } from "../../hooks/course-list/useDeleteCourse.ts";
import { LoadingPage } from "../../../../components/ui/Loadings.tsx";
import { ConfirmModal } from "../../../../components/ui/modals/ConfirmModal.tsx";
import { CourseListFormModal } from "../ui/CourseListFormModal.tsx";
import { IoSchool } from "react-icons/io5";
import type { ModalModeTypes } from "../../../../types";

export function CoursesListLayout() {
    const navigate = useNavigate();
    const { id: activeCourseId } = useParams<{ id: string }>();

    const [modalMode, setModalMode] = useState<ModalModeTypes>('none');
    const [courseToEdit, setCourseToEdit] = useState<any>(null);
    const [teacherToEdit, setTeacherToEdit ] = useState<any>(null);
    const [courseToDelete, setCourseToDelete] = useState<any>(null);

    const { loading, courses, fetchCourses } = useCourseData();
    const { loadingDelete, deleteCourseById } = useDeleteCourse(fetchCourses);

    const handleEdit = useCallback((course: any) => {
        setCourseToEdit(course);
        setTeacherToEdit(course.director_id);
        setModalMode('edit');
    }, []);

    const handleDelete = useCallback((courseId: string) => {
        const course = courses.find((s: any) => s.id === courseId);
        setCourseToDelete(course || null);
    }, [courses]);

    const handleNavigate = useCallback((id: string) => {
        navigate(`${id}`);
    }, [navigate]);

    if (loading) return <LoadingPage title="Cargando cursos..." />

    return (
        <div className="flex flex-col lg:flex-row gap-5 h-[calc(100dvh-6rem)] md:h-[calc(100dvh-2.5rem)] ">
            <div className={`bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col ${activeCourseId ? 'hidden lg:flex' : 'flex'} lg:w-1/3 xl:w-1/4`}>
                <div className="p-5 border-b border-gray-100 grid grid-cols-3 justify-between gap-5 items-start md:items-center rounded-t-xl bg-white z-10">
                    <h2 className="text-xl font-bold col-span-2 text-custom-black w-full">Cursos</h2>
                    <PrimaryButton
                        full={false}
                        onClick={() => {
                            setCourseToEdit(null);
                            setModalMode('create');
                        }}
                        title="+"
                    />
                </div>

                <CoursesList
                    courses={courses}
                    activeCourseId={activeCourseId}
                    onEditCourse={handleEdit}
                    onDeleteCourse={handleDelete}
                    onNavigate={handleNavigate}
                    loadingDelete={loadingDelete}
                />
            </div>
            <div className={`bg-white rounded-xl shadow-sm border border-gray-100 flex-1 no-scrollbar overflow-y-auto ${!activeCourseId ? 'hidden lg:flex items-center justify-center' : 'flex flex-col'}`}>
                {activeCourseId ? (
                    <Outlet key={activeCourseId} />
                ) : (
                    <div className="flex items-center justify-center flex-col text-gray-400 p-10">
                        <IoSchool className="text-4xl text-primary" />
                        <h3 className="text-xl font-medium text-gray-500">Selecciona un curso</h3>
                        <p className="text-sm text-center mt-2">Haz clic en un curso de la lista para ver sus detalles, estudiantes y clases asignadas.</p>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={courseToDelete !== null}
                onClose={() => setCourseToDelete(null)}
                onConfirm={async () => {
                    if (courseToDelete) {
                        await deleteCourseById(courseToDelete.id);
                        setCourseToDelete(null);
                        navigate("/principal/cursos/")
                    }
                }}
                title="¿Estás seguro?"
                message={`¿Quieres eliminar el curso ${courseToDelete?.course_name}? Esta acción no se puede deshacer.`}
                loadingDelete={loadingDelete}
            />

            {modalMode !== "none" && (
                <CourseListFormModal
                    mode={modalMode}
                    teacherId={teacherToEdit}
                    course={courseToEdit}
                    onClose={() => {
                        setTeacherToEdit(null);
                        setModalMode('none');
                    }}
                    onSuccess={async () => {
                        setTeacherToEdit(null);
                        setModalMode('none');
                        await fetchCourses();
                    }}
                />
            )}
        </div>
    )
}