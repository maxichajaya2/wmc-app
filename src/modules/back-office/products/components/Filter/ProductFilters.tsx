import {
    Button, DropdownMenu,
    DropdownMenuContent, DropdownMenuTrigger
} from "@/components"
import './styles.css'

function ProductFilters() {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    disabled
                    variant="outline"
                    className="h-8 gap-1 flex justify-between transition-all duration-500"
                >
                    Filtros
                </Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-3">
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProductFilters