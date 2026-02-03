"use client"

import { useFormContext } from "react-hook-form";

interface ChoiceTagProps {
    name: string;
    value: string;
    label: string;
    type?: "checkbox" | "radio";
    color?: "blue" | "green";
}

export const ChoiceTag = ({ name, value, label, type = "checkbox", color = "blue" }: ChoiceTagProps) => {
    const { register, watch } = useFormContext();
    const watchedValue = watch(name);
    
    // 選択されているかどうかを判定
    const isSelected = Array.isArray(watchedValue) 
        ? watchedValue.includes(value) 
        : watchedValue === value;

    const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer select-none whitespace-nowrap";
    
    const colorClasses = color === "blue" 
        ? isSelected 
            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
            : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 active:bg-gray-50"
        : isSelected 
            ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-100" 
            : "bg-white border-gray-200 text-gray-600 hover:border-green-300 active:bg-gray-50";

    return (
        <label className={`${baseClasses} ${colorClasses}`}>
            <input 
                type={type}
                {...register(name)}
                value={value}
                className="hidden"
            />
            {label}
        </label>
    );
};
