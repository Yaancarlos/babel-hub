import { useClassData } from "../../../../features/director/class-management/hooks/useClassData.ts";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { LoadingContent } from "../../../../components/ui/Loadings.tsx";
import { formatterDate } from "../../../../types";

import { ClassLayout } from "../../../../features/director/class-management";
import { Assignments } from "../../../../features/director/class-management/components/tabs/Assigments.tsx";
import { RegisterAttendance } from "../../../../features/director/class-management/components/tabs/RegisterAttendance.tsx";
import { Students } from "../../../../features/director/class-management/components/tabs/Students.tsx";
import { ViewAttendance } from "../../../../features/director/class-management/components/tabs/ViewAttendance.tsx";

type TabTypes = 'students' | 'register attendance' | 'see attendance' | 'assignments';

export default function ClassesDetails() {
    const { id, courseId } = useParams<{ id: string, courseId: string }>();
    const [tab, setTab] = useState<TabTypes>("students")


    if (!id || !courseId) return null;

    const { data, loading } = useClassData(id);
    const initialDate = formatterDate.format(new Date());

    if (loading) return <LoadingContent title="Cargando clase..."/>;
    if (!data) return <div className="p-6 text-gray-500 text-center flex-1">Clase no encontrada.</div>;

    return (
        <ClassLayout
            data={data}
            activeTab={tab}
            onTabChange={setTab}
        >
            {tab === "students" && (<Students students={data.students} />)}
            {tab === "register attendance" && (<RegisterAttendance classData={data} date={initialDate} />)}
            {tab === "see attendance" && (<ViewAttendance classData={data} courseId={courseId} />)}
            {tab === "assignments" && (<Assignments assignments={data.assignments} />)}
        </ClassLayout>
    )
}