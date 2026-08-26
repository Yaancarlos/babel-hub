import { useNavigate } from "react-router-dom";
import ListData, {type ListItemProps} from "../../../components/ui/lists/List.tsx";
import { PiChalkboardTeacherLight, PiStudentLight } from "react-icons/pi";
import { RiParentLine } from "react-icons/ri";

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
        },
        {
            label: "Padres",
            onClick: () => navigate("/principal/comunidad/padres"),
            icon: <RiParentLine />,
            text: "Administra a todos los padres/acudentes de tu escuela en este apartado"
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