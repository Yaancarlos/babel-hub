import { useGradingTemplateData } from "../../hooks/grading-templates/useGradingTemplateData.ts";

export function GradingTemplateLayout() {
    const { loading, gradingTemplates } = useGradingTemplateData();

    console.log(gradingTemplates, loading);

    return (
        <div className="w-full flex justify-center items-center px-2 py-5 md:p-5">
            <div className="text-center">
                <p className="text-gray-400">Lo sentimos, actualmente estamos trabajando esta sección.</p>
            </div>
        </div>
    )
}