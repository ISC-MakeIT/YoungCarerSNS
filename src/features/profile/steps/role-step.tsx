"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/step-container";
import { SelectionCard } from "../../../components/selection-card";

interface RoleStepProps {
    setRole: (role: 'carer' | 'supporter') => void;
}

const RoleStep = ({ setRole }: RoleStepProps) => {
    const { register } = useFormContext();

    return (
        <StepContainer description="あなたの役割を教えてください。">
            <div className="grid grid-cols-1 gap-4">
                <SelectionCard 
                    type="radio"
                    name="role"
                    value="carer"
                    register={register}
                    title="一般"
                    description="悩み相談や交流をしたい方"
                    onChange={() => setRole('carer')}
                />
                <SelectionCard 
                    type="radio"
                    name="role"
                    value="supporter"
                    register={register}
                    title="サポーター"
                    description="知識や経験を活かして支援したい方"
                    onChange={() => setRole('supporter')}
                />
            </div>
        </StepContainer>
    )
};

RoleStep.title = "役割";

export default RoleStep;