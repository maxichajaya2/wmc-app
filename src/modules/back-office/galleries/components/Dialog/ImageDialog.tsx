import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface ImageModalProps {
    isOpen: boolean
    onClose: () => void
    imageUrl: string
}

export function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTitle />
            <DialogDescription />
            <DialogContent className="max-w-4xl w-full p-0">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/75 focus:outline-none"
                >
                    <X className="h-5 w-5" />
                </button>
                <img src={imageUrl || "/placeholder.svg"} alt="Expanded view" className="w-full h-auto" />
            </DialogContent>
            <DialogFooter />
        </Dialog>
    )
}

