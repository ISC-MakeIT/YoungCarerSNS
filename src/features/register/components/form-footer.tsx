"use client"

interface FormFooterProps {
    onNext: () => void;
    isLastStep: boolean;
    isLoading?: boolean;
    label?: string;
}

export function FormFooter({ onNext, isLastStep, isLoading, label }: FormFooterProps) {
    return (
        <footer className="flex-none bg-white border-t border-gray-200 p-4 sticky bottom-0 z-10">
            <button
                onClick={onNext}
                disabled={isLoading}
                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
                {isLoading ? "送信中..." : label || (isLastStep ? "はじめる" : "次へ")}
            </button>
        </footer>
    );
}
