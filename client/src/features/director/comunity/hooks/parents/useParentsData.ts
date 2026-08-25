import {useState, useEffect, useCallback} from "react";
import type { Parent } from "../../types";
import { getParents } from "../../api";

export const useParentsData = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [parents, setParents] = useState<Parent[]>([]);
    const [trigger, setTrigger] = useState<number>(0);

    const refetch = useCallback(() => {
        setTrigger((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const fetchParents = async () => {
            setLoading(true);
            try {
                const response = await getParents();
                setParents(response);
            } catch (error : any) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchParents();
    }, [trigger]);

    return { loading, parents, refetch };
}