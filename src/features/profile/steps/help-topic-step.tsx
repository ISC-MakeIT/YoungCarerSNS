"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { FormField } from "../../../components/ui/form-field";
import { ChoiceTag } from "../../../components/ui/choice-tag";
import { VisibilityToggle } from "../../../components/ui/visibility-toggle";

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
        <StepContainer description={role === "carer" ? "どのようなサポートが必要ですか？（複数選択可）" : "どのようなサポートが可能ですか？（複数選択可）"}>
            <div className="flex flex-wrap gap-2">
                {helpTopics.map((topic) => (
                    <ChoiceTag 
                        key={topic.id}
                        name="helpTopics"
                        value={topic.id}
                        label={role === "carer" ? topic.carerLabel : topic.supporterLabel}
                        color="blue"
                    />
                ))}
            </div>

            <div className="mt-8">
                <FormField label="その他（自由記述）" name="helpTopicOther">
                    <input 
                        type="text" 
                        {...register("helpTopicOther")} 
                        placeholder="例：話し相手がほしい、など" 
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    />
                </FormField>
            </div>

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