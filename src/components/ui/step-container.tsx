"use client"

import { ReactNode } from "react";

interface StepContainerProps {
    description?: string;
    children: ReactNode;
}

export const StepContainer = ({ description, children }: StepContainerProps) => {
    return (
        <div className="space-y-6">
            {description && <p className="text-gray-600">{description}</p>}
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};
