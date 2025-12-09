import { useState } from "react";
import { ClothingItem } from "./useWardrobe";
import { generateOutfitRecommendation } from "@/lib/gemini";

export interface ChatMessage {
    id: string;
    sender: "user" | "ai";
    text: string;
    isOutfit?: boolean;
    outfitItems?: ClothingItem[];
    occasion?: string;
}

export const usePairChat = (fullWardrobe: ClothingItem[] = []) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    const sendMessage = async (userText: string) => {
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: "user",
            text: userText,
        };
        setMessages((prev) => [userMsg, ...prev]);

        if (fullWardrobe.length === 0) {
            setTimeout(() => {
                const emptyMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    sender: "ai",
                    text: "I'd love to help, but your wardrobe is empty! Please upload some clothes first.",
                };
                setMessages((prev) => [emptyMsg, ...prev]);
            }, 500);
            return;
        }

        setIsThinking(true);

        try {
            const wardrobeContext = fullWardrobe.map((item) => ({
                id: item.id,
                type: item.type,
                desc: item.description,
                tags: item.tags,
            }));

            const suggestion = await generateOutfitRecommendation(userText, wardrobeContext);

            if (!suggestion) throw new Error("Could not generate an outfit.");

            const matchedItems = fullWardrobe.filter((item) => suggestion.selected_item_ids.includes(item.id));
            console.log("MATCHIms", matchedItems);

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                text: suggestion.ai_description,
                isOutfit: matchedItems.length > 0,
                outfitItems: matchedItems,
                occasion: suggestion.occasion,
            };

            setMessages((prev) => [aiMsg, ...prev]);
        } catch (error) {
            console.error(error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                text: "Sorry, I had trouble analyzing your wardrobe. Please try again.",
            };
            setMessages((prev) => [errorMsg, ...prev]);
        } finally {
            setIsThinking(false);
        }
    }

    return { messages, isThinking, sendMessage};
}