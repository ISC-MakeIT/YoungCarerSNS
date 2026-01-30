"use client"

import { ChevronLeft } from "lucide-react";

interface FormHeaderProps {
    title: string;
    onBack?: () => void;
}

export function FormHeader({ title, onBack }: FormHeaderProps) {
    return (
        <header className="flex-none bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2 sticky top-0 z-10">
            {onBack && (
                <button 
                    type="button"
                    onClick={onBack}
                    className="p-1 -ml-1 hover:bg-gray-50 rounded-full transition-colors text-gray-600"
                    aria-label="戻る"
                >
                    <ChevronLeft size={24} />
                </button>
            )}
            <h1 className="text-lg font-bold text-gray-800">
                {title}
            </h1>
        </header>
    );
}
