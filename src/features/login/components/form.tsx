"use client"

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormHeader } from "@/features/register/components/form-header";
import { FormFooter } from "@/features/register/components/form-footer";
import { FormField } from "@/components/ui/form-field";
import { submitForm } from "../actions/submit-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
    const methods = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const result = await submitForm({ email: data.email, password: data.password });
            if (result?.success) {
                router.push("/home");
            } else if (result?.error) {
                if (result.error === "Invalid login credentials") {
                    setErrorMessage("メールアドレスかパスワードが違います");
                } else {
                    setErrorMessage(result.error);
                }
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("ログインに失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col h-screen bg-gray-50 overflow-hidden">
                <FormHeader title="ログイン" onBack={() => router.push("/")}/>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <div className="max-w-md mx-auto space-y-8">
                            <div className="space-y-6">
                                <FormField label="メールアドレス" name="email" error={methods.formState.errors.email}>
                                    <input
                                        type="email"
                                        {...methods.register("email", { 
                                            required: "メールアドレスは必須です",
                                            pattern: {
                                                value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                                message: "有効なメールアドレスを入力してください"
                                            }
                                        })}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="example@mail.com"
                                    />
                                </FormField>

                                <FormField label="パスワード" name="password" error={methods.formState.errors.password}>
                                    <input
                                        type="password"
                                        {...methods.register("password", { required: "パスワードは必須です" })}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="パスワードを入力"
                                    />
                                </FormField>
                            </div>

                            <div className="text-center">
                                <Link 
                                    href="/register" 
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    アカウント作成はこちら
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>

                {errorMessage && (
                    <div className="px-6 py-3 bg-red-50 border-t border-red-100 text-red-600 text-sm font-medium">
                        {errorMessage}
                    </div>
                )}

                <FormFooter onNext={methods.handleSubmit(onSubmit)} isLastStep={true} isLoading={isLoading} label="ログイン" />
            </form>
        </FormProvider>
    );
}

export default LoginForm;
