"use client"

import { FormProvider, useForm } from "react-hook-form"
import { useState, useCallback } from "react"
import { useFormNavigation } from "../hooks/use-form-navigation"
import { FormHeader } from "./form-header"
import { FormStepRender } from "./form-step-render"
import { FormFooter } from "./form-footer"
import { submitForm } from "../actions/submit-form"
import { useRouter } from "next/navigation"

interface FormContainerProps {
    masters: {
        helpTopicMaster: any[]
        chatStanceMaster: any[]
    }
}

export function FormContainer({ masters }: FormContainerProps) {
    const methods = useForm({
        defaultValues: {
            email: "",
            password: "",
            role: "",
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
    } = useFormNavigation();

    const router = useRouter();

    const handleBack = useCallback(() => {
        if (currentStepIndex > 0) {
            back();
            return;
        }
        router.push('/');
    }, [currentStepIndex, back, router]);

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: any) => {
        if (!isLastStep) {
            next();
            return;
        }

        setIsLoading(true);
        try {
            const result = await submitForm(data);
            if (result?.success) {
                router.push("/home");
            }
        } catch (error) {
            console.error(error);
            alert("予期せぬエラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col min-h-screen bg-gray-50">
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

                <FormFooter 
                    onNext={methods.handleSubmit(onSubmit)}
                    isLastStep={isLastStep}
                    isLoading={isLoading}
                />
            </form>
        </FormProvider>
    )
}