"use client"

interface FormFooterProps {
    onNext: () => void;
    isLastStep: boolean;
    isLoading?: boolean;
}

export function FormFooter({ onNext, isLastStep, isLoading }: FormFooterProps) {
    return (
        <footer className="p-4 border-t bg-white sticky bottom-0">
            <button
                onClick={onNext}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
                {isLoading ? "送信中..." : isLastStep ? "はじめる" : "次へ"}
            </button>
        </footer>
    );
}
