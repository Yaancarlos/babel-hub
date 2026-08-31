import { CumulativeGPALayout } from "../../../features/parent/cumulativeGPA/components";
import { useState } from "react";
import type { CumulativeGPATypes } from "../../../features/parent/cumulativeGPA/types/types.ts";
import { useParentData } from "../../../features/parent/cumulativeGPA/hooks/useParentData.ts";
import {LoadingContent} from "../../../components/ui/Loadings.tsx";
import {NoResults} from "../../../components/ui/blocks/NoResults.tsx";
import {Grades} from "../../../features/parent/cumulativeGPA/components/grades/Grades.tsx";

export default function CumulativeGPA() {
    const [tab, setTab] = useState<CumulativeGPATypes>('grades');
    const { loading, students} = useParentData();

    console.log(students);

    if (loading) return <LoadingContent title=""/>;
    if (students.length === 0) return <NoResults title='Estudiantes no asignados a este acudiante' />;

    return (
        <CumulativeGPALayout
            student={students}
            activeTab={tab}
            onButtonChange={setTab}
        >
            {tab === 'grades' && (<Grades students={students} />)}
            {tab === 'observations' && (<></>)}
            {tab === 'attendance' && (<></>)}
        </CumulativeGPALayout>
    )
}