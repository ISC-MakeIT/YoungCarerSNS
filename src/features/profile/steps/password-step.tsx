"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { FormField } from "../../../components/ui/form-field";

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
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
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
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                />
            </FormField>
        </StepContainer>
    )
};

PasswordStep.title = "パスワード";

export default PasswordStep;