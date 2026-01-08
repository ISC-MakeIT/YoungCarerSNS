"use client"

import { useFormContext } from "react-hook-form";

interface VisibilityToggleProps {
    name: string;
    label: string;
}

export const VisibilityToggle = ({ name, label }: VisibilityToggleProps) => {
    const { register } = useFormContext();

    return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <label className="flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    {...register(name)} 
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-blue-800">
                    {label}
                </span>
            </label>
        </div>
    );
};
