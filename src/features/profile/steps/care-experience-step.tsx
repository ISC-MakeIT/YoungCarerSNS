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
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
            </FormField>
        </StepContainer>
    )
};

CareExperienceStep.title = "ケア経験";

export default CareExperienceStep;