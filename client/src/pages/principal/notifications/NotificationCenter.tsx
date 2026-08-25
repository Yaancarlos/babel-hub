import { LuNotebookPen } from "react-icons/lu";
import ListData, {type ListItemProps} from "../../../components/ui/lists/List.tsx";
import { useNavigate } from "react-router-dom";

function NotificationCenter() {
    const navigate = useNavigate();

    const listItems: ListItemProps[] = [
        {
            label: "Asistencia",
            onClick: () => navigate("asistencia"),
            icon: <LuNotebookPen />,
            text: "Monitorea las inasistencias y llegadas tarde de cada estudiante",
        }
    ]

    return (
      <ListData data={listItems}/>
    )
}

export default NotificationCenter;