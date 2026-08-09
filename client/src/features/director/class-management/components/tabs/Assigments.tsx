import { NoResults } from "../../../../../components/ui/blocks/NoResults.tsx";
import { useAssignmentOverview } from "../../hooks/useAssignmentOverview.ts";

interface AssignmentsProps {
    courseId: string;
    classId: string;
}

export function Assignments({ classId, courseId }: AssignmentsProps) {
    const { assignments } = useAssignmentOverview(courseId, classId);

    console.log(assignments);

    if (assignments.length === 0) {
        return (
            <div className="md:col-span-2 lg:col-span-3">
                <NoResults title="No hay asignaciones creadas todavía" />
            </div>
        );
    }

    return (
        <></>
    )
}