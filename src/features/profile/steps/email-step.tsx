"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { FormField } from "../../../components/ui/form-field";

const EmailStep = () => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <StepContainer description="ログインに使用するメールアドレスを入力してください。">
            <FormField 
                label="メールアドレス" 
                name="email" 
                error={errors.email}
            >
                <input 
                    type="email" 
                    {...register("email", { 
                        required: "メールアドレスは必須です",
                        pattern: {
                            value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                            message: "有効なメールアドレスを入力してください"
                        }
                    })} 
                    placeholder="example@mail.com" 
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                />
            </FormField>
        </StepContainer>
    )
};

EmailStep.title = "メールアドレス";

export default EmailStep;