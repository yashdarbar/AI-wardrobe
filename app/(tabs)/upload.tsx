import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Auth from "../../components/Auth";
import Account from "../../components/Account";
import { Session } from "@supabase/supabase-js";

export default function Upload() {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <View>
            <Text>Upload</Text>
            {session && session.user ? (
                <Account key={session.user.id} session={session} />
            ) : (
                <Auth />
            )}
        </View>
    );
}
