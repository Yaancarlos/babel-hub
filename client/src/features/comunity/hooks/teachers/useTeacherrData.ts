import {useQuery} from "@tanstack/react-query";
import {getTeachers} from "../../api";

export const useTeacherData = () => {
    const {
        data: teachers = [],
        isLoading: loading,
        refetch: reload
    } = useQuery({
        queryKey: ['teachers'],
        queryFn: async () => await getTeachers(),
        staleTime: 1000 * 60 * 5
    });

    return { teachers, loading, reload };
}