"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { ChoiceTag } from "../../../components/ui/choice-tag";
import { VisibilityToggle } from "../../../components/ui/visibility-toggle";

interface ChatStanceStepProps {
    role?: 'carer' | 'supporter';
    masters: {
        chatStanceMaster: any[];
    };
}

const ChatStanceStep = ({ role, masters }: ChatStanceStepProps) => {
    const { register } = useFormContext();
    const chatStances = masters.chatStanceMaster;

    return (
        <StepContainer description="チャットでのコミュニケーションについて教えてください。（複数選択可）">
            <div className="flex flex-wrap gap-2">
                {chatStances.map((stance) => (
                    <ChoiceTag 
                        key={stance.id}
                        name="chatStance"
                        value={stance.id}
                        label={role === "carer" ? stance.carerLabel : stance.supporterLabel}
                        color="green"
                    />
                ))}
            </div>

            {role === "carer" && (
                <VisibilityToggle 
                    name="chatStanceVisibility" 
                    label="チャットの雰囲気をプロフィールで公開する" 
                />
            )}
        </StepContainer>
    )
};

ChatStanceStep.title = (role?: 'carer' | 'supporter') => 
    role === 'carer' ? "求める雰囲気" : "雰囲気";

export default ChatStanceStep;