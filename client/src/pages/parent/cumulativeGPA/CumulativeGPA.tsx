import { CumulativeGPALayout } from "../../../features/parent/cumulativeGPA/components";
import { useState, useEffect } from "react";
import type { CumulativeGPATypes } from "../../../features/parent/cumulativeGPA/types/types.ts";
import { useParentData } from "../../../features/parent/cumulativeGPA/hooks/useParentData.ts";
import { LoadingContent } from "../../../components/ui/Loadings.tsx";
import { NoResults } from "../../../components/ui/blocks/NoResults.tsx";
import { usePeriods } from "../../../shared/hooks/usePeriods.ts";

import { Grades } from "../../../features/parent/cumulativeGPA/components/grades/Grades.tsx";
import { Attendance } from "../../../features/parent/cumulativeGPA/components/attendance/Attendance.tsx";

export default function CumulativeGPA() {
    const [tab, setTab] = useState<CumulativeGPATypes>('grades');
    const { periods } = usePeriods();
    const { loading, students } = useParentData();
    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

    useEffect(() => {
        if (periods && periods.length > 0 && !selectedPeriodId) {
            setSelectedPeriodId(periods[0].id);
        }
    }, [periods, selectedPeriodId]);

    if (loading) return <LoadingContent title="" />;
    if (students.length === 0) return <NoResults title='Estudiantes no asignados a este acudiante' />;
    if (periods.length === 0) return <NoResults title="No se encontraron periodos" />;

    const selectedPeriod = periods.find(p => p.id === selectedPeriodId) || periods[0];

    return (
        <CumulativeGPALayout
            student={students}
            activeTab={tab}
            onButtonChange={setTab}
            periods={periods}
            selectedPeriodId={selectedPeriod?.id}
            onPeriodChange={setSelectedPeriodId}
        >
            {tab === 'grades' && (<Grades students={students} periodId={selectedPeriod?.id} />)}
            {tab === 'attendance' && (<Attendance students={students} period={selectedPeriod} />)}
        </CumulativeGPALayout>
    );
}