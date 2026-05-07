import ListData, { type ListItemProps } from "../../../../../components/ui/lists/List.tsx";
import { PeriodsLayout } from "../periods/PeriodsLayout.tsx";
import { AreasLayout } from "../areas/AreasLayout.tsx";

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
            content: (
                <div className="w-full flex justify-center items-center px-2 py-5 md:p-5">
                    <div className="text-center">
                        <p className="text-gray-400">Lo sentimos, actualmente estamos trabajando esta sección.</p>
                    </div>
                </div>
            )
        },
        {
            label: "Centro de Asistencia"
        }
    ]

    return (
        <ListData data={schoolSetupItems} />
    )
}