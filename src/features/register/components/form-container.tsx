"use client"

import { FormProvider, useForm } from "react-hook-form"
import { useState, useCallback, useEffect } from "react"
import { useFormNavigation, Role } from "../hooks/use-form-navigation"
import { FormHeader } from "./form-header"
import { FormStepRender } from "./form-step-render"
import { FormFooter } from "./form-footer"
import { submitForm } from "../actions/submit-form"
import { useRouter, useSearchParams } from "next/navigation"

interface FormContainerProps {
    masters: {
        helpTopicMaster: any[]
        chatStanceMaster: any[]
    }
}

export function FormContainer({ masters }: FormContainerProps) {
    const searchParams = useSearchParams();
    const queryRole = searchParams.get('role') as Role;
    const initialRole = queryRole === 'supporter' ? 'supporter' : 'carer';

    const methods = useForm({
        defaultValues: {
            email: "",
            password: "",
            role: initialRole,
            displayName: "",
            prefecture: "",
            city: "",
            helpTopics: [] as string[],
            helpTopicOther: "",
            chatStance: "",

            familySituation: "",
            locationVisibility: "public",
            helpTopicVisibility: "public",
            chatStanceVisibility: "public",
            familySituationVisibility: "public",

            careExperience: "",
            learningBackground: ""
        }
    })

    const { 
        currentStepIndex, 
        CurrentStep, 
        next, 
        back, 
        role, 
        setRole, 
        title,
        isLastStep
    } = useFormNavigation(initialRole);

    // 同期を保つために useEffect を使用（または setRole をラップする）
    // values.role が React Hook Form 側で変更されたときに hook 側の state も更新する必要がある
    const watchedRole = methods.watch("role") as Role;
    useEffect(() => {
        if (watchedRole && watchedRole !== role) {
            setRole(watchedRole);
        }
    }, [watchedRole, role, setRole]);

    const router = useRouter();

    const handleBack = useCallback(() => {
        if (currentStepIndex > 0) {
            back();
            return;
        }
        router.push('/');
    }, [currentStepIndex, back, router]);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: any) => {
        if (!isLastStep) {
            next();
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        try {
            const result = await submitForm(data);
            if (result?.success) {
                router.push("/home");
            } else if (result?.error) {
                const error = result.error.toLowerCase();
                if (error.includes("rate") && error.includes("limit")) {
                    setErrorMessage("リクエストが多すぎます。しばらく時間をおいてから再度お試しください。");
                } else if (error.includes("email") && (error.includes("invalid"))) {
                    setErrorMessage("メールアドレスの形式が正しくありません。");
                } else {
                    setErrorMessage(result.error);
                }
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("予期せぬエラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col h-screen bg-gray-50 overflow-hidden">
                <FormHeader 
                    title={title} 
                    onBack={handleBack} 
                />
                
                <main className="flex-1 overflow-y-auto">
                    <FormStepRender 
                        CurrentStep={CurrentStep} 
                        role={role} 
                        setRole={setRole}
                        masters={masters}
                    />
                </main>

                {errorMessage && (
                    <div className="px-6 py-3 bg-red-50 border-t border-red-100 text-red-600 text-sm font-medium">
                        {errorMessage}
                    </div>
                )}

                <FormFooter 
                    onNext={methods.handleSubmit(onSubmit)}
                    isLastStep={isLastStep}
                    isLoading={isLoading}
                />
            </form>
        </FormProvider>
    )
}