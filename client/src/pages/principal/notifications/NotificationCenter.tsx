import ListData from "../../../components/ui/lists/List.tsx";
import { useNavigate } from "react-router-dom";

function NotificationCenter() {
    const navigate = useNavigate();

    const listItems = [
        {
            label: "Asistencia",
            onClick: () => navigate("asistencia")
        }
    ]

    return (
      <ListData data={listItems}/>
    )
}

export default NotificationCenter;