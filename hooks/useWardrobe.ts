//hooks/useWardrobe.ts
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export interface ClothingItem {
    id: string;
    user_id: string;
    image_url: string;
    type: "top" | "bottom" | "footwear";
    description: string;
    tags: string[];
}

export const useWardrobe = (filterType: string | null) => {
    const userId = useAuthStore((state) => state.session?.user.id);

    return useQuery<ClothingItem[], Error>({
        queryKey: ["wardrobe", userId, filterType],

        queryFn: async () => {
            if (!userId) throw new Error("User is not authenticated!");

            let query = supabase
                .from("clothing_items")
                .select("id, image_url, description, type, tags")
                .eq("user_id", userId);

            if (filterType && filterType !== "All") {
                query = query.eq("type", filterType.toLowerCase());
            }

            const { data, error } = await query.order("created_at", {
                ascending: false,
            });

            if (error) throw error;
            return data as ClothingItem[];
        },

        enabled: !!userId,
    });
};
