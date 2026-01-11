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
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
            </FormField>
        </StepContainer>
    )
};

BioStep.title = "自己紹介";

export default BioStep;
