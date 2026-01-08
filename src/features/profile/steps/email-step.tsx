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
                    {...register("email", { required: "メールアドレスは必須です" })} 
                    placeholder="example@mail.com" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </FormField>
        </StepContainer>
    )
};

EmailStep.title = "メールアドレス";

export default EmailStep;