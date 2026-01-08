"use client"

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormHeader } from "@/features/register/components/form-header";
import { FormFooter } from "@/features/register/components/form-footer";
import { FormField } from "@/components/ui/form-field";
import { submitForm } from "../actions/submit-form";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const methods = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const result = await submitForm({ email: data.email, password: data.password });
            if (result?.success) {
                router.push("/home");
            }
        } catch (err) {
            console.error(err);
            alert("ログインに失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col min-h-screen bg-gray-50">
                <FormHeader title="ログイン" onBack={() => router.push("/")}/>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        <div className="max-w-md mx-auto space-y-6">
                            <FormField label="メールアドレス" name="email" error={methods.formState.errors.email}>
                                <input
                                    type="email"
                                    {...methods.register("email", { required: "メールアドレスは必須です" })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="example@mail.com"
                                />
                            </FormField>

                            <FormField label="パスワード" name="password" error={methods.formState.errors.password}>
                                <input
                                    type="password"
                                    {...methods.register("password", { required: "パスワードは必須です" })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </FormField>

                            <div className="text-right">
                                <a href="/register" className="text-sm text-blue-600">アカウント作成はこちら</a>
                            </div>
                        </div>
                    </div>
                </main>

                <FormFooter onNext={methods.handleSubmit(onSubmit)} isLastStep={true} isLoading={isLoading} />
            </form>
        </FormProvider>
    );
}

export default LoginForm;
