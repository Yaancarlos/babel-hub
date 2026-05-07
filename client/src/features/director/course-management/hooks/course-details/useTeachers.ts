import { useQuery } from "@tanstack/react-query";
import { getAllTeachers } from "../../api";

export const useTeachers = () => {
    const {
        data: teachers = [],
        refetch: reloadTeachers,
    } = useQuery({
        queryKey: ['teachers'],
        queryFn: async () => await getAllTeachers(),
        staleTime: 1000 * 60 * 15,
    });

    return { teachers, reloadTeachers };
}