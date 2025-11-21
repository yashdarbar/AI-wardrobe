import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface AuthSession {
    session: Session | null;
    setSession: (session: Session | null) => void;
    isLoaded: boolean;
    setIsLoaded: (loaded: boolean) => void;
}

export const useAuthStore = create<AuthSession>((set) => ({
    session: null,
    isLoaded: false,
    setSession: (session) => set({ session }),
    setIsLoaded: (isLoaded) => set({ isLoaded })
}))