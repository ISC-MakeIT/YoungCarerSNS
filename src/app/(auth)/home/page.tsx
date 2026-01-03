import { createClient } from "@/lib/supabase/server";

export default async function userHome() {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Error fetching user:", error);
        return <div>エラーが発生しました</div>;
    }

    return (
        <div>
            <h1>利用者ページ</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}