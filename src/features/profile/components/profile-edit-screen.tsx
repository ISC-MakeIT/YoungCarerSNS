import { getMyProfile } from "@/features/profile/api/profile";
import { getChatStanceMaster, getHelpTopicMaster } from "@/features/profile/api/master";
import { ProfileEdit } from "./profile-edit";
import { redirect } from "next/navigation";
import { SetTitle } from "@/components/layout/set-title";

export default async function ProfileEditScreen() {
    const profile = await getMyProfile();
    
    if (!profile) {
        redirect("/login");
    }

    const [chatStanceMaster, helpTopicMaster] = await Promise.all([
        getChatStanceMaster(),
        getHelpTopicMaster()
    ]);

    const masters = {
        chatStanceMaster,
        helpTopicMaster
    };

    return (
        <div className="max-w-2xl mx-auto bg-white min-h-screen">
            <SetTitle title="プロフィール設定" />
            <ProfileEdit initialData={profile} masters={masters} />
        </div>
    );
}
