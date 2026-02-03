"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { FormField } from "../../../components/ui/form-field";

const CareExperienceStep = () => {
    const { register } = useFormContext();

    return (
        <StepContainer description="これまでのケア経験について教えてください。">
            <FormField label="ケア経験の内容" name="careExperience">
                <textarea 
                    {...register("careExperience")} 
                    placeholder="例：祖父の介護を5年間経験しました。" 
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                />
            </FormField>
        </StepContainer>
    )
};

CareExperienceStep.title = "ケア経験";

export default CareExperienceStep;