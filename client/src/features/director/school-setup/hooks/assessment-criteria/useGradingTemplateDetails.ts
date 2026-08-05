import { useState, useEffect, useCallback } from "react";
import type { GradingDetails } from "../../types";
import { getGradingDetails } from "../../api";

export const useGradingTemplateDetails = (gradingId: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [gradingTemplateDetails, setGradingTemplateDetails] = useState<GradingDetails | undefined>(undefined);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const getGradingDetailsById = async () => {
            if (!gradingId) return;

            setLoading(true);
            try {
                const record = await getGradingDetails(gradingId);
                setGradingTemplateDetails(record);
            } catch (error : any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getGradingDetailsById();
    }, [gradingId, trigger]);

    return { loading, gradingTemplateDetails, refetch };
}