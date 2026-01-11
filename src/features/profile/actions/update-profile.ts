"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "認証されていません" };

    const userId = user.id;

    // profiles table update
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            display_name: formData.displayName,
            prefecture: formData.prefecture,
            city: formData.city,
            help_topics: formData.helpTopics || [],
            help_topic_other: formData.helpTopicOther || null,
            chat_stances: formData.chatStance || [],
            bio: formData.bio || null,
        })
        .eq('id', userId);

    if (profileError) {
        console.error("Profile Error:", profileError);
        return { error: "プロフィールの更新に失敗しました" };
    }

    // Role specific profiles
    if (formData.role === 'carer') {
        const { error: carerError } = await supabase
            .from('carer_profiles')
            .upsert({
                user_id: userId,
                family_situation: formData.familySituation || null,
                location_visibility: formData.locationVisibility || 'public',
                help_topic_visibility: formData.helpTopicVisibility ? 'public' : 'private',
                chat_stance_visibility: formData.chatStanceVisibility ? 'public' : 'private',
                family_situation_visibility: formData.familySituationVisibility ? 'public' : 'private',
            });
        if (carerError) {
            console.error("Carer Profile Error:", carerError);
        }
    } else if (formData.role === 'supporter') {
        const { error: supporterError } = await supabase
            .from('supporter_profiles')
            .upsert({
                user_id: userId,
                care_experience: Array.isArray(formData.careExperience) ? formData.careExperience : (formData.careExperience ? [formData.careExperience] : []),
                learning_background: Array.isArray(formData.learningBackground) ? formData.learningBackground : (formData.learningBackground ? [formData.learningBackground] : []),
            });
        if (supporterError) {
            console.error("Supporter Profile Error:", supporterError);
        }
    }

    revalidatePath('/profile/edit');
    revalidatePath(`/profile/${userId}`);
    
    return { success: true };
}
