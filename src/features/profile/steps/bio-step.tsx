"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { FormField } from "../../../components/ui/form-field";

const BioStep = () => {
    const { register } = useFormContext();

    return (
        <StepContainer description="自己紹介文を入力してください。">
            <FormField label="自己紹介" name="bio">
                <textarea 
                    {...register("bio")} 
                    placeholder="こんにちは！よろしくお願いします。" 
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                />
            </FormField>
        </StepContainer>
    )
};

BioStep.title = "自己紹介";

export default BioStep;
