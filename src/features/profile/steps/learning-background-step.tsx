"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { FormField } from "../../../components/ui/form-field";

const LearningBackgroundStep = () => {
    const { register } = useFormContext();

    return (
        <StepContainer description="専門知識や学習背景について教えてください。">
            <FormField label="学習背景・資格など" name="learningBackground">
                <textarea 
                    {...register("learningBackground")} 
                    placeholder="例：社会福祉士の資格を保有しています。大学でヤングケアラー支援について研究していました。" 
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                />
            </FormField>
        </StepContainer>
    )
};

LearningBackgroundStep.title = "学習背景";

export default LearningBackgroundStep;