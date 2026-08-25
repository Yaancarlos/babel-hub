import { create } from "zustand";
import type { UserRole } from "../types";

export interface UserProfile {
    id: string;
    first_name: string;
    middle_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
    role: UserRole;
    email: string;
    is_active: boolean;
    school_id: string | null;
    profile_id: string | null;
    is_profile_complete: boolean;
}

interface AuthState {
    token: string | null;
    user: UserProfile | null;
    loading: boolean;
    setAuth: (token: string, user: UserProfile) => void;
    logout: () => void;
}

//We're using localstorage so we save it in the user's browser
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

export const useAuth = create<AuthState>((set) => ({
    token: storedToken || null,
    user: storedUser ? JSON.parse(storedUser) : null,
    loading: false,

    setAuth: (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ token, user, loading: false });
    },
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null });
    }
}));