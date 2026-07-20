import ButtonChevronBack from "../../../../../components/ui/buttons/ButtonChevrowBack.tsx";
import { reverseName } from "../../../../../types";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacherProfile } from "../../hooks/teachers/useTeacherProfile.ts";
import { LoadingContent } from "../../../../../components/ui/Loadings.tsx";
import { TeacherInformation } from "../ui/TeacherInformation.tsx";

export function TeacherProfileLayout() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { loading, profile } = useTeacherProfile(id);

    if (loading) return <LoadingContent title="Cargando perfil del profesor..." />;
    if (!profile) return <div className="p-6 text-gray-500">Profesor no encontrado.</div>;

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <ButtonChevronBack onClick={() => navigate(-1)} />

                    <div className="flex items-center gap-5 w-full">
                        <div className="p-3 md:p-4 shrink-0 rounded-full bg-primary-shadow flex items-center justify-center text-primary-darker font-bold text-xl md:text-2xl shadow-inner">
                            {`${profile.teacher.teacher_first_name.charAt(0)}${profile.teacher.teacher_first_last_name.charAt(0)}`}
                        </div>

                        <div className="flex grow justify-between">
                            <div>
                                <h1 className="text-xl md:text-1xl xl:text-2xl font-bold text-custom-black">
                                    {reverseName({
                                        firstLastName: profile.teacher.teacher_first_last_name,
                                        firstName: profile.teacher.teacher_first_name,
                                        middleName: profile.teacher.teacher_middle_name,
                                        secondLastName: profile.teacher.teacher_second_last_name
                                    })}
                                </h1>
                                <p className="text-gray-500 text-sm md:text-base mt-1">{profile.teacher.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TeacherInformation
                teacher={profile.classes}
            />
        </div>
    )
}