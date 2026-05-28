export type UserProfileResponse = {
    id: string;
    name: string;
    role: string;
    email: string;
    school_id: string | null;
    profile_id: string | null;
    is_profile_complete: boolean;
};