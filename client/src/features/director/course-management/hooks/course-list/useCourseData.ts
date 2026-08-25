import { getCourses } from "../../api";
import type { CoursesListData } from "../../types";
import { useQuery } from '@tanstack/react-query';

export const useCourseData = () => {
    const {
        data: courses = [],
        isLoading: loading,
        refetch: fetchCourses,
    } = useQuery<CoursesListData[]>({
        queryKey: ['courses'],
        queryFn: async () => await getCourses(),
        staleTime: 1000 * 60 * 30,
    });

    return { loading, courses, fetchCourses };
}