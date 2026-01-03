"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/step-container";
import { FormField } from "../../../components/form-field";

const PasswordStep = () => {
    const { register, watch, formState: { errors } } = useFormContext();
    const password = watch("password");

    return (
        <StepContainer description="安全なパスワードを設定してください。">
            <FormField 
                label="パスワード" 
                name="password" 
                error={errors.password}
            >
                <input 
                    type="password" 
                    {...register("password", { 
                        required: "パスワードは必須です",
                        minLength: { value: 8, message: "パスワードは8文字以上である必要があります" }
                    })} 
                    placeholder="英数字8文字以上" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </FormField>

            <FormField 
                label="パスワード（確認）" 
                name="confirmPassword" 
                error={errors.confirmPassword}
            >
                <input 
                    type="password" 
                    {...register("confirmPassword", { 
                        required: "確認用パスワードを入力してください",
                        validate: (value) => value === password || "パスワードが一致しません"
                    })} 
                    placeholder="もう一度入力してください" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </FormField>
        </StepContainer>
    )
};

PasswordStep.title = "パスワード";

export default PasswordStep;