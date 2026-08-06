import {useState, useEffect, useCallback} from "react";
import { getAreaDetails } from "../../api";
import type { AreaDetails } from "../../types";

export const useAreaDetails = (id: string) => {
    const [loading, setLoading] = useState(false);
    const [areaDetails, setAreaDetails] = useState<AreaDetails | undefined>(undefined);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const refetch = useCallback(() => {
        setReloadTrigger((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const getAreaById = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const areaDetails = await getAreaDetails(id);
                setAreaDetails(areaDetails);
            } catch (error : any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getAreaById();
    }, [id, reloadTrigger]);

    return { loading, areaDetails , refetch };
}