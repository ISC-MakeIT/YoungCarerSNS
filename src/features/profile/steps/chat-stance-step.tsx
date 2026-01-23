"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { SelectionCard } from "../../../components/ui/selection-card";
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
        <StepContainer description="チャットでのコミュニケーションについて教えてください。">
            <div className="grid grid-cols-1 gap-3">
                {chatStances.map((stance) => (
                    <SelectionCard 
                        key={stance.id}
                        type="checkbox"
                        name="chatStance"
                        value={stance.id}
                        register={register}
                        title={role === "carer" ? stance.carerLabel : stance.supporterLabel}
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