import { cn } from "@/lib/utils";

interface TypographySmallProps {
    children: React.ReactNode;
    className?: string;
}
export function TypographySmall({ children, className }: TypographySmallProps) {
    return (
        <div className={cn(
            "text-sm font-medium leading-none",
            className
        )}>
            {children}
        </div>
    )
}