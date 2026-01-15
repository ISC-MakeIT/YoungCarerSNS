"use client"

import { useForm, FormProvider } from "react-hook-form";
import { Avatar } from "@/components/ui/avatar";
import { 
    DisplayNameStep, 
    LocationStep, 
    HelpTopicStep, 
    ChatStanceStep, 
    FamilySituationStep, 
    CareExperienceStep, 
    LearningBackgroundStep,
    BioStep
} from "../steps";
import { useRouter } from "next/navigation";
import { updateProfile } from "../actions/update-profile";
import { logout } from "../actions/logout";
import { useState } from "react";

interface ProfileEditProps {
    initialData: any;
    masters: {
        helpTopicMaster: any[];
        chatStanceMaster: any[];
    };
}

export const ProfileEdit = ({ initialData, masters }: ProfileEditProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const methods = useForm({
        defaultValues: {
            role: initialData.role,
            displayName: initialData.display_name || "",
            prefecture: initialData.prefecture || "",
            city: initialData.city || "",
            helpTopics: initialData.help_topics || [],
            helpTopicOther: initialData.help_topic_other || "",
            chatStance: initialData.chat_stances || [],
            bio: initialData.bio || "",
            // Carer specific
            familySituation: initialData.family_situation || "",
            locationVisibility: initialData.location_visibility || "public",
            helpTopicVisibility: initialData.help_topic_visibility === "public",
            chatStanceVisibility: initialData.chat_stance_visibility === "public",
            familySituationVisibility: initialData.family_situation_visibility === "public",
            // Supporter specific
            careExperience: initialData.care_experience?.[0] || "",
            learningBackground: initialData.learning_background?.[0] || "",
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const result = await updateProfile(data);
        setIsSubmitting(false);
        if (result.success) {
            router.push(`/profile/${initialData.id}`);
            router.refresh();
        } else {
            alert("更新に失敗しました");
        }
    };

    const handleLogout = async () => {
        if (confirm("ログアウトしますか？")) {
            await logout();
        }
    };

    const handleDeleteAccount = () => {
        alert("アカウント削除機能は現在サポートにお問い合わせいただく必要があります。");
    };

    const role = initialData.role;

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="pb-20">
                <div className="flex flex-col items-center py-8">
                    <div className="relative group cursor-pointer" onClick={() => alert("画像アップロード機能は準備中です")}>
                        <Avatar className="w-24 h-24 text-4xl" />
                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs">変更</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 space-y-10">
                    <DisplayNameStep />
                    <LocationStep role={role} />
                    
                    {role === 'carer' && <FamilySituationStep />}
                    
                    {role === 'supporter' && (
                        <>
                            <CareExperienceStep />
                            <LearningBackgroundStep />
                        </>
                    )}

                    <HelpTopicStep role={role} masters={masters} />
                    <ChatStanceStep role={role} masters={masters} />
                    <BioStep />

                    <div className="pt-6 space-y-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                            {isSubmitting ? "保存中..." : "保存する"}
                        </button>

                        <div className="pt-10 space-y-2 border-t">
                             <button 
                                type="button"
                                onClick={handleLogout}
                                className="w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                             >
                                 ログアウト
                             </button>
                             <button 
                                type="button"
                                onClick={handleDeleteAccount}
                                className="w-full py-3 text-gray-400 text-sm hover:text-gray-600 transition-colors"
                             >
                                 アカウント削除
                             </button>
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};
