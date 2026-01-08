"use client"

import { ReactNode } from "react";

interface SelectionCardProps {
    type: "radio" | "checkbox";
    name: string;
    value: string;
    register: any;
    title: string;
    description?: string;
    className?: string;
    onChange?: (e: any) => void;
}

export const SelectionCard = ({ 
    type, 
    name, 
    value, 
    register, 
    title, 
    description,
    className = "",
    onChange
}: SelectionCardProps) => {
    const { onChange: registerOnChange, ...rest } = register(name);

    const handleChange = (e: any) => {
        registerOnChange(e);
        if (onChange) onChange(e);
    };

    return (
        <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group ${className}`}>
            <input 
                type={type} 
                {...rest}
                value={value} 
                onChange={handleChange}
                className={`${type === 'radio' ? 'w-6 h-6' : 'w-5 h-5'} text-blue-600 border-gray-300 focus:ring-blue-500`}
            />
            <div className="ml-4">
                <span className="block font-bold text-gray-900 group-hover:text-blue-700">
                    {title}
                </span>
                {description && (
                    <span className="block text-sm text-gray-500">
                        {description}
                    </span>
                )}
            </div>
        </label>
    );
};
