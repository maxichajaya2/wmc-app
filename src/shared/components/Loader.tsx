import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface LoaderProps {
    className?: string;
}
export const Loader = ({ className }: LoaderProps) => {
    return (
        <div className={cn("min-h-screen grid place-content-center", className)} >
            <LoaderCircle size={24} className="animate-spin text-primary" />
        </div>
    );
};
