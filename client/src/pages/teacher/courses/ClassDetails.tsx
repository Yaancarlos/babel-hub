import {
    Assignments,
    ClassLayout,
    RegisterAttendance,
    Students,
    ViewAttendance
} from "../../../features/teacher/class-management";
import {useClassData} from "../../../features/teacher/class-management/class-details/hooks/useClassData.ts";
import {useParams} from "react-router-dom";
import {useState} from "react";
import {LoadingContent} from "../../../components/ui/Loadings.tsx";
import {formatterDate} from "../../../types";

type TabTypes = 'students' | 'register attendance' | 'see attendance' | 'assignments';

export default function ClassDetails() {
    const { id: classId } = useParams();

    if (!classId) return null;

    const [activeTab, setActiveTab] = useState<TabTypes>("students");
    const date = formatterDate.format(new Date());

    const { loading, classData } = useClassData(classId);

    if (loading) return <LoadingContent title="Cargando clase..."/>;
    if (!classData) return <div className="p-6 text-gray-500 text-center flex-1">Clase no encontrada.</div>;

    return (
        <ClassLayout
            classDetails={classData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {activeTab === "students" && (<Students students={classData.students} />)}
            {activeTab === "register attendance" && (<RegisterAttendance classData={classData} date={date} classId={classId}/>)}
            {activeTab === "see attendance" && (<ViewAttendance courseId={classData.course_id} classId={classId} />)}
            {activeTab === "assignments" && (<Assignments assignments={[]} />)}
        </ClassLayout>
    )
}