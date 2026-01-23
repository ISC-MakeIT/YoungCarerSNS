"use server"

import { createClient } from "@/lib/supabase/server";

export async function submitForm(formData: any) {
    const supabase = await createClient();

    // 1. Auth SignUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
    });

    if (authError || !authData.user) {
        console.error("Auth Error:", authError);
        return { error: authError?.message || "認証に失敗しました" };
    }

    const userId = authData.user.id;

    // 2. Profile Insert (public.profiles)
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            role: formData.role,
            display_name: formData.displayName,
            prefecture: formData.prefecture,
            city: formData.city,
            help_topics: formData.helpTopics || [],
            help_topic_other: formData.helpTopicOther || null,
            chat_stances: formData.chatStance || [],
        });

    if (profileError) {
        console.error("Profile Error:", profileError);
        return { error: "プロフィールの作成に失敗しました" };
    }

    // 3. Role specific profiles
    if (formData.role === 'carer') {
        const { error: carerError } = await supabase
            .from('carer_profiles')
            .insert({
                user_id: userId,
                family_situation: formData.familySituation || null,
                location_visibility: formData.locationVisibility || 'public',
                help_topic_visibility: formData.helpTopicVisibility ? 'public' : 'private',
                family_situation_visibility: formData.familySituationVisibility ? 'public' : 'private',
            });
        if (carerError) {
            console.error("Carer Profile Error:", carerError);
        }
    } else if (formData.role === 'supporter') {
        const { error: supporterError } = await supabase
            .from('supporter_profiles')
            .insert({
                user_id: userId,
                care_experience: formData.careExperience ? [formData.careExperience] : [],
                learning_background: formData.learningBackground ? [formData.learningBackground] : [],
            });
        if (supporterError) {
            console.error("Supporter Profile Error:", supporterError);
        }
    }

    return { success: true };
}
