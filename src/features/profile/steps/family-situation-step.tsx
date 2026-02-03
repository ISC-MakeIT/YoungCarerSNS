"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { FormField } from "../../../components/ui/form-field";
import { VisibilityToggle } from "../../../components/ui/visibility-toggle";

const FamilySituationStep = () => {
    const { register } = useFormContext();

    return (
        <StepContainer description="現在の家庭状況について教えてください。">
            <FormField label="家庭状況" name="familySituation">
                <textarea 
                    {...register("familySituation")} 
                    placeholder="例：高齢の家族の生活サポートをしている" 
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                />
            </FormField>

            <VisibilityToggle 
                name="familySituationVisibility" 
                label="この内容をプロフィールで公開する" 
            />
        </StepContainer>
    )
};

FamilySituationStep.title = "状況";

export default FamilySituationStep;