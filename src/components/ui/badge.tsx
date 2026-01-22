export function Badge({ 
  children, 
  variant = "default",
  className = ""
}: { 
  children: React.ReactNode, 
  variant?: "default" | "primary",
  className?: string
}) {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    primary: "bg-blue-100 text-blue-600",
  };
  
  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
