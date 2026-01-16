import { getHelpTopicMaster, getChatStanceMaster } from "../../profile/api/master"
import { FormContainer } from "./form-container"
import { Suspense } from "react"

export default async function RegisterForm() {
    const masters = {
        helpTopicMaster: await getHelpTopicMaster(),
        chatStanceMaster: await getChatStanceMaster(),
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FormContainer masters={masters} />
        </Suspense>
    )
}