import {Outlet, useNavigate, useParams} from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/client.ts";
import {LoadingPage} from "../../../components/ui/Loadings.tsx";
import {IoSchool} from "react-icons/io5";
import {InteractiveHomeList} from "../../../components/ui/lists/InteractiveHomeList.tsx";

interface TeacherCourse {
    id: string;
    name: string;
    total_students: string | number;
}

interface TeacherClass {
    class_id: string;
    subject_name: string;
    course_name: string;
    course_id: string;
    total_students: number;
}

function TeacherCourses() {
    const { id: activeCourseId } = useParams();
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState<TeacherCourse | null>(null);
    const [classData, setClassData] = useState<TeacherClass[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoursesAndClasses = async () => {
            try {
                const [courseRes, classesRes] = await Promise.all([
                    api.get("/courses/teacher/course"),
                    api.get("/classes/teacher/classes")
                ]);

                setCourseData(courseRes.data.teacherCourse || null);
                setClassData(classesRes.data.teacherClasses || []);
            } catch (error: any) {
                console.error("Error fetching teacher data:", error);
                setError("Error al cargar el curso o las clases");
            } finally {
                setLoading(false);
            }
        }

        fetchCoursesAndClasses();
    }, []);

    if (loading) return <LoadingPage title="Cargando..."/>

    return (
        <div className="flex flex-col lg:flex-row gap-5 h-[calc(100dvh-6rem)] md:h-[calc(100dvh-2.5rem)] ">
            <div className={`bg-white rounded-xl shadow-sm border border-gray-100 flex h-full flex-col ${activeCourseId ? 'hidden lg:flex' : 'flex'} lg:w-1/3 xl:w-1/4`}>
                <div className="flex flex-col h-full p-3 space-y-2">
                    {courseData && (
                        <InteractiveHomeList
                            isActive={activeCourseId === courseData.id}
                            disabled={true}
                            onClick={() => navigate(`${courseData.id}`)}
                            avatarText={courseData.name ? courseData.name.replace("-", "") : "UNK"}
                            title={<span className="capitalize">Curso {courseData.name}</span>}
                            subtitle={`${courseData.total_students} Estudiantes`}
                        />
                    )}

                    {error && <p className="text-red-500 m-4 text-sm">{error}</p>}

                    <hr className="w-full rounded-full border border-gray-100"/>

                    <div className="space-y-2 flex-1 overflow-y-auto styled-scrollbar overflow-x-hidden">
                        { classData.length === 0 && (
                            <div className="p-5 lg:p-10 text-center">
                                <p className="text-gray-500">No tienes clases asignadas en este momento.</p>
                            </div>
                        ) }

                        { classData.length > 0 && (
                            classData.map((item) => (
                                <InteractiveHomeList
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
                                            onClick: () => {},
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
                    <Outlet  key={activeCourseId} />
                ) : (
                    <div className="flex items-center justify-center flex-col text-gray-400 p-10">
                        <IoSchool className="text-4xl text-primary" />
                        <h3 className="text-xl font-medium text-custom-black">Selecciona una clase</h3>
                        <p className="text-sm mt-2 text-center">Haz clic en una clase de la lista para ver sus detalles y estudiante.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherCourses;