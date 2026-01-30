import { ReflectionForm } from "@/features/reflection/components/form"
import { getHelpTopicMaster } from "@/features/profile/api/master"
import { createClient } from "@/lib/supabase/server"

export default async function ReflectionPage() {
  const helpTopics = await getHelpTopicMaster();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return <ReflectionForm helpTopics={helpTopics} userId={user?.id} />
}
