import type { CoursesListData } from "../../types";
import { useNavigate } from "react-router-dom";
import {InteractiveHomeList} from "../../../../../components/ui/lists/InteractiveHomeList.tsx";

interface CoursesListProps {
    courses: CoursesListData[];
    activeCourseId: string | undefined;
    onEditCourse: (course: CoursesListData) => void;
    onDeleteCourse: (id: string) => void;
    onNavigate: (id: string) => void;
    loadingDelete: boolean;
}

export function CoursesList({ courses, activeCourseId, onEditCourse, onDeleteCourse, loadingDelete, onNavigate }: CoursesListProps) {
    const navigate = useNavigate();

    return (
        <div className="p-3 space-y-2 flex-1 overflow-y-auto styled-scrollbar overflow-x-hidden">
            {
                courses.map((course) => (
                    <InteractiveHomeList
                        isActive={activeCourseId === course.id}
                        onClick={() => onNavigate(course.id)}
                        avatarText={course.course_name ? course.course_name.replace("-", "") : "UNK"}
                        title={<span>Curso <span className="uppercase">{course.course_name}</span></span>}
                        subtitle={`${course.director_name || "Sin director"} • ${course.student_count || 0} Est.`}
                        menuOptions={[
                            {
                                label: "Ver asistencia",
                                onClick: () => navigate(`/principal/notificaciones/asistencia?course=${course.course_name}`)
                            },
                            {
                                label: "Ver notas",
                                onClick: () => {},
                                disabled: true
                            },
                            {
                                label: "Editar",
                                onClick: () => onEditCourse(course)
                            },
                            { label: "SEPARATOR" },
                            {
                                label: loadingDelete ? "Cargando..." : "Eliminar",
                                onClick: () => onDeleteCourse(course.id),
                                disabled: loadingDelete,
                                isDanger: true
                            },
                        ]}
                    />
                ))
            }
        </div>
    )
}