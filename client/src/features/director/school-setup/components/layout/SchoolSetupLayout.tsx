import ListData, { type ListItemProps } from "../../../../../components/ui/lists/List.tsx";
import { PeriodsLayout } from "../periods/PeriodsLayout.tsx";
import { AreasLayout } from "../areas/AreasLayout.tsx";
import { GradingTemplateLayout } from "../grading-templates/GradingTemplateLayout.tsx";
import {HiOutlineBookOpen} from "react-icons/hi";
import {IoCalendarOutline} from "react-icons/io5";
import {LuClipboardList, LuUserCheck} from "react-icons/lu";

export function SchoolSetupLayout() {
    const schoolSetupItems: ListItemProps[] = [
        {
            label: "Áreas",
            content: (<AreasLayout />),
            icon: <HiOutlineBookOpen />,
            text: "Organiza tus asignaturas por campos de conocimiento"
        },
        {
            label: "Periodos",
            content: (<PeriodsLayout />),
            icon: <IoCalendarOutline />,
            text: "Configura los ciclos académicos del año"
        },
        {
            label: "Porcentajes Evaluativos",
            content: (<GradingTemplateLayout />),
            icon: <LuClipboardList />,
            text: "Define cómo se distribuyen las calificaciones"
        },
        {
            label: "Centro de Asistencia",
            icon: <LuUserCheck />,
            text: "Administra la configuración de asistencia"
        }
    ]

    return (
        <div className="p-2">
            <ListData data={schoolSetupItems} />
        </div>
    )
}