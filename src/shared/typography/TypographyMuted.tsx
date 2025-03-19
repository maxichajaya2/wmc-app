import { cn } from "@/lib/utils";

interface TypographyMutedProps {
    children: React.ReactNode;
    className?: string;
}
export function TypographyMuted({ children, className }: TypographyMutedProps) {
    return (
        <div className={cn(
            "text-sm text-muted-foreground",
            className
        )}>
            {children}
        </div>
    )
}