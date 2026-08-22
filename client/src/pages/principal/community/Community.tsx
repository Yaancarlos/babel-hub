import { useNavigate } from "react-router-dom";
import ListData, {type ListItemProps} from "../../../components/ui/lists/List.tsx";
import { PiChalkboardTeacherLight, PiStudentLight } from "react-icons/pi";

function Community () {
    const navigate = useNavigate();

    const listItems: ListItemProps[] = [
        {
            label: "Estudiantes",
            onClick: () => navigate("/principal/comunidad/estudiantes"),
            icon: <PiStudentLight />,
            text: "Administra a todos tus estudiantes en este apartado",
        },
        {
            label: "Profesores",
            onClick: () => navigate("/principal/comunidad/profesores"),
            icon: <PiChalkboardTeacherLight />,
            text: "Administra a todos tus profesores en este apartado"
        }
    ]

    return (
        <div>
            <ListData
                data={listItems}
            />
        </div>
    );
}

export default Community;