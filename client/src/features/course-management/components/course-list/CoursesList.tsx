import { HiDotsVertical } from "react-icons/hi";
import type { CoursesListData } from "../../types";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";

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
    const ref = useRef<HTMLUListElement | null>(null);

    const [indexOption, setIndexOption] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIndexOption(null);
            }
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [ref]);

    const handleShowOptions = (index: number, e: React.MouseEvent) => {
        if (indexOption === index) {
            setIndexOption(null);
            return;
        }

        const clickY = e.clientY;
        const windowHeight = window.innerHeight;

        if (windowHeight - clickY < 250) {
            setMenuPosition('top');
        } else {
            setMenuPosition('bottom');
        }

        setIndexOption(index);
    };

    return (
        <div className="p-3 space-y-2 flex-1 overflow-y-auto styled-scrollbar overflow-x-hidden">
            {courses.map((course, index) => (
                <div
                    key={course.id}
                    className={`w-full group px-2 xl:px-3 py-4 2xl:p-4 relative rounded-xl transition-colors flex items-center justify-between gap-2 2xl:gap-3 border ${
                        activeCourseId === course.id
                            ? 'bg-primary-shadow border-primary-shadow'
                            : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                    }`}
                >
                    <button
                        onClick={() => onNavigate(course.id)}
                        className="flex items-center cursor-pointer text-left gap-2">
                        <div className={`w-10 h-10 shrink-0 rounded-full flex uppercase items-center justify-center font-bold text-sm ${
                            activeCourseId === course.id ? 'bg-primary text-white' : 'bg-primary-shadow text-primary'
                        }`}>
                            {course.course_name ? course.course_name.replace("-", "") : "UNK"}
                        </div>
                        <div className="max-w-full lg:max-w-28 2xl:max-w-36 overflow-hidden">
                            <h3 className={`font-bold text-base truncate ${activeCourseId === course.id ? 'text-primary-900' : 'text-custom-black'}`}>
                                Curso <span className="uppercase">{course.course_name}</span>
                            </h3>
                            <p className="text-gray-500 text-xs truncate">
                                {course.director_name || "Sin director"} • {course.student_count || 0} Est.
                            </p>
                        </div>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShowOptions(index, e);
                        }}
                        className="hover:bg-gray-100 cursor-pointer p-1.5 text-custom-black text-sm xl:opacity-0 xl:group-hover:opacity-100 transition-opacity md:text-base rounded-full ">
                        <HiDotsVertical />
                    </button>
                    {indexOption === index && (
                        <ul
                            ref={ref}
                            className={`absolute z-50 w-48 h-fit p-2 text-sm md:text-base font-semibold right-4 bg-white text-custom-black shadow-lg border border-gray-100 rounded-xl ${
                                menuPosition === 'top' ? 'bottom-12' : 'top-12'
                            }`}
                        >
                            <li>
                                <button
                                    onClick={() => navigate(`/principal/notificaciones/asistencia?course=${course.course_name}`)}
                                    className="p-2 w-full text-left cursor-pointer hover:bg-gray-100 rounded-xl"
                                >
                                    Ver asistencia
                                </button>
                            </li>
                            <li>
                                <button className="p-2 cursor-not-allowed w-full text-left hover:bg-gray-100 rounded-xl">
                                    Ver notas
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onEditCourse(course)}
                                    className="p-2 w-full text-left cursor-pointer hover:bg-gray-100 rounded-xl">
                                    Editar
                                </button>
                            </li>
                            <hr className="border border-gray-100 rounded-xl my-2" />
                            <li>
                                <button
                                    onClick={() => onDeleteCourse(course.id)}
                                    disabled={loadingDelete}
                                    className="p-2 w-full text-left cursor-pointer hover:bg-red-shadow text-red-error rounded-xl">
                                    {loadingDelete ? "Cargando..." : "Eliminar"}
                                </button>
                            </li>
                        </ul>
                    )
                    }
                </div>
            ))}
        </div>
    )
}