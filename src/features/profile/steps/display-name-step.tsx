"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/step-container";
import { FormField } from "../../../components/form-field";

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
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </FormField>
        </StepContainer>
    )
};

DisplayNameStep.title = "ニックネーム";

export default DisplayNameStep;