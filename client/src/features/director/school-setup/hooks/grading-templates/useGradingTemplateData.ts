import { useState, useEffect } from "react";
import type { GradingTemplate } from "../../types";
import { getGradingTemplates } from "../../api";

export const useGradingTemplateData = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [gradingTemplates, setGradingTemplates] = useState<GradingTemplate[]>([]);

    useEffect(() => {
        const fetchGradingTemplates = async () => {
            setLoading(true);
            try {
                console.log("Fetching Grading Templates");
                const gradingTemplates = await getGradingTemplates();
                setGradingTemplates(gradingTemplates);
            } catch (error: any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchGradingTemplates();
    }, []);

    return { loading, gradingTemplates }
}