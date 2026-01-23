"use client"

import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface FormFieldProps {
    label: string;
    name: string;
    error?: any;
    children: ReactNode;
    hint?: string;
}

export const FormField = ({ label, name, error, children, hint }: FormFieldProps) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {children}
            {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
            {error && (
                <p className="mt-1 text-xs text-red-500">{error.message as string}</p>
            )}
        </div>
    );
};
