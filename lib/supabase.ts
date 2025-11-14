import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://shmdiywcwnoxvhgkvorc.supabase.co";
const supabasePublishableKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNobWRpeXdjd25veHZoZ2t2b3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDA5OTksImV4cCI6MjA3ODI3Njk5OX0.ZRTzMNbXl-PSgpW5YQJera13Ta2zNVJq4B0-rCVjh5A";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
