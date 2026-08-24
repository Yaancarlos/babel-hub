import { useAuth } from "../../auth/useAuth.ts";
import {
    BiBell,
    BiBookBookmark,
    BiCalendar,
    BiFile,
    BiGroup,
    BiMessageDetail,
    BiSolidDashboard,
    BiUserVoice
} from "react-icons/bi";
import Home from "../../components/Home.tsx";

export default function ParentLayout() {
    const user = useAuth(state => state.user);

    const gridItems = [
        { id: "1", icon: <BiSolidDashboard />, path: "/parent/dashboard", label: "Dashboard" },
        { id: "2", icon: <BiCalendar />, path: "/unknow", label: "Calendario" },
        { id: "3", icon: <BiBookBookmark />, path: "/unknow", label: "Cursos" },
        { id: "4", icon: <BiBell />, path: "/unknow", label: "Notificaciones" },
        { id: "5", icon: <BiGroup />, path: "/unknow", label: "Comunidad" },
        { id: "6", icon: <BiUserVoice />, path: "/unknow", label: "Acudientes" },
        { id: "7", icon: <BiFile />, path: "/unknow", label: "Formatos" },
        { id: "8", icon: <BiMessageDetail />, path: "/unknow", label: "Mensajes" }
    ];

    return (
        <Home user={user} grid={gridItems}/>
    )
}