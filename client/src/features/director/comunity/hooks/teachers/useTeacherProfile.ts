import { useState, useEffect } from 'react';
import { getTeacherById } from "../../api";
import type { ClassItem, TeacherItem } from "../../types";

interface TeacherProfileData {
    teacher: TeacherItem;
    classes: ClassItem[];
}

export const useTeacherProfile = (id: string | undefined) => {
    const [profile, setProfile] = useState<TeacherProfileData>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const response = await getTeacherById(id);
                setProfile(response);
            } catch (error : any) {
                console.error(error.response?.data?.message || "Error al cargar el perfil del profesor.");
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [id]);

    return { loading, profile };
}