import { getHelpTopicMaster } from "../../profile/actions/get-help-topic-master"
import { getChatStanceMaster } from "../../profile/actions/get-chat-stance-master"
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