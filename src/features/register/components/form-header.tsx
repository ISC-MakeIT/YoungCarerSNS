"use client"

interface FormHeaderProps {
    title: string;
    onBack?: () => void;
}

export function FormHeader({ title, onBack }: FormHeaderProps) {
    return (
        <header className="flex items-center p-4 border-b bg-white sticky top-0 z-10">
        
            <button 
                type="button"
                onClick={onBack}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="戻る"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                </svg>
            </button>

            <h1 className="text-lg font-bold flex-1 text-center mr-8">
                {title}
            </h1>
        </header>
    );
}
