import ListData, { type ListItemProps } from "../../../../../components/ui/lists/List.tsx";
import { PeriodsLayout } from "../periods/PeriodsLayout.tsx";
import { AreasLayout } from "../areas/AreasLayout.tsx";
import { GradingTemplateLayout } from "../grading-templates/GradingTemplateLayout.tsx";

export function SchoolSetupLayout() {
    const schoolSetupItems: ListItemProps[] = [
        {
            label: "Áreas",
            content: (<AreasLayout />)
        },
        {
            label: "Periodos",
            content: (<PeriodsLayout />)
        },
        {
            label: "Porcentajes Evaluativos",
            content: (<GradingTemplateLayout />)
        },
        {
            label: "Centro de Asistencia"
        }
    ]

    return (
        <ListData data={schoolSetupItems} />
    )
}