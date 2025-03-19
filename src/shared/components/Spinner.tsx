import { LoaderCircle } from 'lucide-react'

export function Spinner() {
    return (
        <div className="flex items-center justify-center space-x-2">
            <LoaderCircle size={24} className="animate-spin text-white" />
        </div>
    )
}
