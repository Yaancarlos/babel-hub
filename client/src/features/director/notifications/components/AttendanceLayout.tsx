import ButtonChevronBack from "../../../../components/ui/buttons/ButtonChevrowBack.tsx";
import { useNavigate } from "react-router-dom";

interface AttendanceLayoutProps {
    children: React.ReactNode;
}

export function AttendanceLayout({ children }: AttendanceLayoutProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full gap-4 md:gap-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center">
                <div className="flex gap-2 items-center">
                    <ButtonChevronBack onClick={() => navigate(-1)}/>
                    <div>
                        <h1 className="text-xl md:text-1xl xl:text-2xl font-bold text-custom-black">Asistencias</h1>
                        <p className="text-gray-400 mt-1 text-sm">Monitorea las inasistencias y llegadas tarde</p>
                    </div>
                </div>
            </div>
            <div className="h-full bg-white rounded-xl p-3 md:p-5 shadow-sm border border-gray-100 no-scrollbar overflow-x-auto">
                { children }
            </div>
        </div>
    )
}