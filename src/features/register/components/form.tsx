import { getHelpTopicMaster, getChatStanceMaster } from "../../profile/api/master"
import { FormContainer } from "./form-container"

export default async function RegisterForm() {
    const masters = {
        helpTopicMaster: await getHelpTopicMaster(),
        chatStanceMaster: await getChatStanceMaster(),
    }

    return (
        <FormContainer masters={masters} />
    )
}