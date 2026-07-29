import { useState, useEffect } from "react";

export const useGradingTemplate = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [gradingTemplates, setGradingTemplates] = useState<any[]>([]);

    useEffect(() => {
        const fetchGradingTemplates = async () => {
            setLoading(true);
            try {
                setGradingTemplates([]);
                return;
            } catch (error: any) {
                setError(error);
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchGradingTemplates();
    }, [])

    return { loading, error, gradingTemplates };
}