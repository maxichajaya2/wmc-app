import type React from "react"
import { Edit, Plus, FolderPlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMenuStore } from "../store/menu.store"

interface MenuActionBarProps {
    onEditMenu: () => void
    onCreateChildMenu: () => void
    onCreateParentMenu: () => void
    onDeleteMenu: () => void
}

export function MenuActionBar({ onEditMenu, onCreateChildMenu, onCreateParentMenu, onDeleteMenu }: MenuActionBarProps) {
    const selected = useMenuStore(state => state.selected)
    const isParentMenu = selected?.parentId === null
    return (
        <TooltipProvider>
            <div className="flex items-center justify-end space-x-2 bg-background p-2 rounded-lg shadow-md w-full">
                <ActionButton icon={<Edit className="h-4 w-4" />} label="Editar Menu" onClick={onEditMenu} />
                {isParentMenu && <ActionButton icon={<Plus className="h-4 w-4" />} label="Crear Submenu" onClick={onCreateChildMenu} />}
                <ActionButton
                    icon={<FolderPlus className="h-4 w-4" />}
                    label="Crear Menu"
                    onClick={onCreateParentMenu}
                />
                <ActionButton icon={<Trash2 className="h-4 w-4" />} label="Eliminar Menu" onClick={onDeleteMenu} />
            </div>
        </TooltipProvider>
    )
}

interface ActionButtonProps {
    icon: React.ReactNode
    label: string
    onClick: () => void
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
    return (
        <Tooltip delayDuration={1}>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClick}>
                    {icon}
                    <span className="sr-only">{label}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    )
}

