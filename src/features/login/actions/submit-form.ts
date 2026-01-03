"use server"

import { createClient } from "@/lib/supabase/server";

export async function submitForm({ email, password }: { email: string; password: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login Error:", error);
        return { error: error.message };
    }

    // success
    return { success: true };
}
