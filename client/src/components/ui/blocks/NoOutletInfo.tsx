import { IoSchool } from "react-icons/io5";

interface NoOutletInfoProps {
    title: string;
    paragraph: string;
}

export function NoOutletInfo({ title, paragraph }: NoOutletInfoProps) {
    return (
        <div className="flex items-center justify-center flex-col text-gray-400 p-10">
            <IoSchool className="text-4xl text-primary" />
            <h3 className="text-xl font-medium text-custom-black">{title}</h3>
            <p className="text-sm mt-2 text-center">{paragraph}</p>
        </div>
    )
}