"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { FormField } from "../../../components/ui/form-field";

const DisplayNameStep = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <StepContainer description="アプリ内で表示される名前を入力してください。">
            <FormField 
                label="表示名（ニックネーム）" 
                name="displayName" 
                error={errors.displayName}
                hint="※後から変更することも可能です。"
            >
                <input 
                    type="text" 
                    {...register("displayName", { required: "表示名は必須です" })} 
                    placeholder="例：たろう" 
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                />
            </FormField>
        </StepContainer>
    )
};

DisplayNameStep.title = "ニックネーム";

export default DisplayNameStep;