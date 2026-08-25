import type { CoursesListData } from "../../types";
import { useNavigate } from "react-router-dom";
import { InteractiveHomeList } from "../../../../../components/ui/lists/InteractiveHomeList.tsx";
import { reverseName } from "../../../../../types";
import { memo } from "react";

interface CoursesListProps {
    courses: CoursesListData[];
    activeCourseId: string | undefined;
    onEditCourse: (course: CoursesListData) => void;
    onDeleteCourse: (course: CoursesListData) => void;
    onNavigate: (id: string) => void;
    loadingDelete: boolean;
}

export const CoursesList = memo(function CoursesList({
                                                               courses,
                                                               activeCourseId,
                                                               onEditCourse,
                                                               onDeleteCourse,
                                                               loadingDelete,
                                                               onNavigate
                                                           }: CoursesListProps) {
    const navigate = useNavigate();

    return (
        <div className="p-3 space-y-2 flex-1 overflow-y-auto styled-scrollbar overflow-x-hidden">
            {courses.map((course) => (
                <InteractiveHomeList
                    key={course.id}
                    isActive={activeCourseId === course.id}
                    onClick={() => onNavigate(course.id)}
                    avatarText={course.course_name ? course.course_name.replace("-", "") : "UNK"}
                    title={<span>Curso <span className="uppercase">{course.course_name}</span></span>}
                    subtitle={`${reverseName({
                        middleName: course.director_middle_name,
                        secondLastName: course.director_second_last_name,
                        firstName: course.director_first_name,
                        firstLastName: course.director_first_last_name
                    }) || "Sin director"} • ${course.student_count || 0} Est.`}
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
                            onClick: () => onDeleteCourse(course),
                            disabled: loadingDelete,
                            isDanger: true
                        },
                    ]}
                />
            ))}
        </div>
    );
});