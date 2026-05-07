import {useState, useEffect, useCallback} from "react";
import {getAreaById, getSubjects} from "../../api";
import type {AreaProps, SubjectsProps} from "../../types";

export const useAreaDetails = (id: string) => {
    const [loading, setLoading] = useState(false);
    const [areaDetails, setAreaDetails] = useState<AreaProps>();
    const [subjects, setSubjects] = useState<SubjectsProps[]>([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const refetch = useCallback(() => {
        setReloadTrigger((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const getAreaDetails = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const area = await getAreaById(id);
                setAreaDetails(area);

                const subjects = await getSubjects(id);
                setSubjects(subjects);
            } catch (error : any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getAreaDetails();
    }, [id, reloadTrigger]);

    return { loading, areaDetails, subjects, refetch };
}