import {useGrades} from "../../hooks/grades/useGrades.ts";
import type {ParentStudent} from "../../types/types.ts";
import {toneBg} from "../../../../../types";
import {LoadingContent} from "../../../../../components/ui/Loadings.tsx";

interface GradesProps {
    students: ParentStudent[]
}

export function Grades({ students }: GradesProps) {
    const { loading, grades } = useGrades(students[0]?.student_id);

    if (loading) <LoadingContent title="" />

    return (
        <div className="flex gap-5 justify-between">
            <div className="w-full">
                <h2 className="md:text-base text-sm font-semibold mb-2 text-left">Materias</h2>
                <div className="w-full flex flex-col gap-2">
                    {grades.map((grade) => (
                        <a
                            href="#"
                            className="p-3 bg-white rounded-xl flex justify-between w-full"
                        >
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${toneBg(grade.final_grade, {
                                    min: grade.scale_min,
                                    max: grade.scale_max,
                                    passing: grade.passing_value
                                })}`} />
                                <span className="capitalize font-semibold">{grade.subject_name}</span>
                            </div>
                            <span className="font-semibold">{grade.final_grade}</span>
                        </a>
                    ))}
                </div>
            </div>
            <div className="w-full">
                <h2 className="md:text-base text-sm font-semibold mb-2 text-left">Radar Académico</h2>
                <div className="bg-primary-shadow/50 rounded-xl h-full"></div>
            </div>
        </div>
    )
}