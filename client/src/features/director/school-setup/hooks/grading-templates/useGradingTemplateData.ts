import { useState, useEffect, useCallback } from "react";
import type { GradingTemplate } from "../../types";
import { getGradingTemplates } from "../../api";

export const useGradingTemplateData = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [gradingTemplates, setGradingTemplates] = useState<GradingTemplate[]>([]);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(async () => {
        setTrigger(prev => prev + 1);
    }, [])

    useEffect(() => {
        const fetchGradingTemplates = async () => {
            setLoading(true);
            try {
                const gradingTemplates = await getGradingTemplates();
                setGradingTemplates(gradingTemplates);
            } catch (error: any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchGradingTemplates();
    }, [trigger]);

    return { loading, gradingTemplates, refetch }
}