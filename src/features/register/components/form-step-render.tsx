"use client"

import { useFormContext } from "react-hook-form";

interface FormStepRenderProps {
    CurrentStep: any;
    role: 'carer' | 'supporter' | null;
    setRole: (role: 'carer' | 'supporter') => void;
    masters: {
        helpTopicMaster: any[];
        chatStanceMaster: any[];
    };
}

export function FormStepRender({ CurrentStep, role, setRole, masters }: FormStepRenderProps) {
    const { register, watch, setValue } = useFormContext();

    // 各ステップに必要な props を渡す
    // role や masters などを共通で渡せるようにする
    return (
        <div className="p-6">
            <CurrentStep 
                role={role} 
                setRole={setRole} 
                masters={masters}
                register={register}
                watch={watch}
                setValue={setValue}
            />
        </div>
    );
}
