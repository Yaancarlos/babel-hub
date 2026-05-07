import { useTeacherClasses } from "../hooks/useTeacherClasses.ts";
import { LoadingPage } from "../../../../../components/ui/Loadings.tsx";
import { InteractiveHomeList } from "../../../../../components/ui/lists/InteractiveHomeList.tsx";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { NoOutletInfo } from "../../../../../components/ui/blocks/NoOutletInfo.tsx";

export function ClassListLayout() {
    const { id: activeCourseId } = useParams();
    const navigate = useNavigate();

    const { loading, error, classes, course } = useTeacherClasses();

    if (loading) return <LoadingPage title="Cargando..."/>

    return (
        <div className="flex flex-col lg:flex-row gap-5 h-[calc(100dvh-6rem)] md:h-[calc(100dvh-2.5rem)] ">
            <div className={`bg-white rounded-xl shadow-sm border border-gray-100 flex h-full flex-col ${activeCourseId ? 'hidden lg:flex' : 'flex'} lg:w-1/3 xl:w-1/4`}>
                <div className="flex flex-col h-full p-3 space-y-2">
                    {course && (
                        <InteractiveHomeList
                            isActive={activeCourseId === course.id}
                            disabled={true}
                            onClick={() => navigate(`${course.id}`)}
                            avatarText={course.name ? course.name.replace("-", "") : "UNK"}
                            title={<span className="capitalize">Curso {course.name}</span>}
                            subtitle={`${course.total_students} Estudiantes`}
                        />
                    )}

                    {error && <p className="text-red-500 m-4 text-sm">{error}</p>}

                    <hr className="w-full rounded-full border border-gray-100"/>

                    <div className="space-y-2 flex-1 overflow-y-auto styled-scrollbar overflow-x-hidden">
                        { classes.length === 0 && (
                            <div className="p-5 lg:p-10 text-center">
                                <p className="text-gray-500">No tienes clases asignadas en este momento.</p>
                            </div>
                        ) }

                        { classes.length > 0 && (
                            classes.map((item) => (
                                <InteractiveHomeList
                                    key={item.class_id}
                                    isActive={activeCourseId === item.class_id}
                                    onClick={() => navigate(`${item.class_id}`)}
                                    avatarText={item.course_name ? item.course_name.replace("-", "") : "UNK"}
                                    title={<span className="capitalize">{item.subject_name} • {item.course_name}</span>}
                                    subtitle={`${item.total_students} estudiantes`}
                                    menuOptions={[
                                        {
                                            label: "Ver asistencia",
                                            onClick: () => navigate(`/teacher/clases/${item.class_id}?button=see attendance`)
                                        },
                                        {
                                            label: "Ver notas",
                                            disabled: true
                                        }
                                    ]}
                                />
                            ))
                        ) }
                    </div>
                </div>
            </div>
            <div className={`bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-y-auto ${!activeCourseId ? 'hidden lg:flex items-center justify-center' : 'flex flex-col'}`}>
                {activeCourseId ? (
                    <Outlet key={activeCourseId} />
                ) : ( <NoOutletInfo title="Selecciona una clase" paragraph="Haz clic en una clase de la lista para ver sus detalles y estudiante." /> )}
            </div>
        </div>
    )
}