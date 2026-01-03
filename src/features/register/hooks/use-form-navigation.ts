import { useState } from 'react';
import * as steps from '../../profile/steps';

export type Role = 'carer' | 'supporter';

export function useFormNavigation() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [role, setRole] = useState<Role | null>(null);

    const getSteps = () => {
        const common = [
            steps.EmailStep,
            steps.PasswordStep,
            steps.DisplayNameStep,
            steps.RoleStep,
        ];

        if (role === 'carer') {
            return [
                ...common,
                steps.LocationStep,
                steps.FamilySituationStep,
                steps.HelpTopicStep,
                steps.ChatStanceStep,
            ];
        }

        if (role === 'supporter') {
            return [
                ...common,
                steps.LocationStep,
                steps.CareExperienceStep,
                steps.LearningBackgroundStep,
                steps.HelpTopicStep,
                steps.ChatStanceStep,
            ];
        }

        return common;
    };

    const allSteps = getSteps();
    const CurrentStep = allSteps[currentStepIndex];

    const next = () => {
        if (currentStepIndex < allSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const back = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const getTitle = (step: any) => {
        if (typeof step.title === 'function') {
            return step.title(role);
        }
        return step.title || "新規登録";
    };

    return {
        currentStepIndex,
        CurrentStep,
        next,
        back,
        role,
        setRole,
        totalSteps: allSteps.length,
        title: getTitle(CurrentStep),
        isLastStep: currentStepIndex === allSteps.length - 1
    };
}
