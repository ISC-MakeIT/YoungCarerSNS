"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/step-container";
import { FormField } from "../../../components/form-field";
import { SelectionCard } from "../../../components/selection-card";
import { VisibilityToggle } from "../../../components/visibility-toggle";

interface HelpTopicStepProps {
    role?: 'carer' | 'supporter';
    masters: {
        helpTopicMaster: any[];
    };
}

const HelpTopicStep = ({ role, masters }: HelpTopicStepProps) => {
    const { register } = useFormContext();
    const helpTopics = masters.helpTopicMaster;

    return (
        <StepContainer description={role === "carer" ? "どのようなサポートが必要ですか？" : "どのようなサポートが可能ですか？"}>
            <div className="grid grid-cols-1 gap-3">
                {helpTopics.map((topic) => (
                    <SelectionCard 
                        key={topic.id}
                        type="checkbox"
                        name="helpTopics"
                        value={topic.id}
                        register={register}
                        title={role === "carer" ? topic.carerLabel : topic.supporterLabel}
                    />
                ))}
            </div>

            <FormField label="その他（自由記述）" name="helpTopicOther">
                <input 
                    type="text" 
                    {...register("helpTopicOther")} 
                    placeholder="例：話し相手がほしい、など" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </FormField>

            {role === "carer" && (
                <VisibilityToggle 
                    name="helpTopicVisibility" 
                    label="選択した支援内容をプロフィールで公開する" 
                />
            )}
        </StepContainer>
    )
};

HelpTopicStep.title = (role?: 'carer' | 'supporter') => 
    role === 'carer' ? "手伝ってほしいこと" : "サポートできること";

export default HelpTopicStep;