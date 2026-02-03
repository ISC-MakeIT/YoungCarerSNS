"use client"

import { useFormContext } from "react-hook-form";

interface VisibilityToggleProps {
    name: string;
    label: string;
}

export const VisibilityToggle = ({ name, label }: VisibilityToggleProps) => {
    const { register } = useFormContext();

    return (
        <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <label className="flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    {...register(name)} 
                    className="w-5 h-5 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-blue-900">
                    {label}
                </span>
            </label>
        </div>
    );
};
