import { getStudents } from "../../api";
import { useQuery } from "@tanstack/react-query";

export const useStudentsData = () => {
    const {
        data: students = [],
        isLoading: loading,
        refetch: reloadStudents
    } = useQuery({
        queryKey: ['students'],
        queryFn: async () => await getStudents(),
        staleTime: 1000 * 60 * 5,
    });

    return { students, loading, reloadStudents };
};