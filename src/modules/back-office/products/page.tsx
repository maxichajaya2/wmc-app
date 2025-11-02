
import {
  File, PlusCircle
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, Button,
  Input
} from "@/components"
import { useCallback, useEffect } from "react"
import { DataTable, DataTableSkeleton, FadeInComponent } from "@/shared"
import { columns } from "./components"
import { useProductsStore } from "./store/products.store"
import ProductFilters from "./components/Filter/ProductFilters"
import ProductDialog from "./components/Dialog/ProductDialog"
import { useCategoryStore } from "../category/store/category.store"
import { useUnitsStore } from "../units/store/units.store"
import { useCheckPermission } from "@/utils"
import { ActionRoles, ModulesRoles } from "@/constants"

function ProductsPage() {
  const loading = useProductsStore(state => state.loading);
  const isOpenDialog = useProductsStore(state => state.isOpenDialog);
  const filtered = useProductsStore(state => state.filtered);
  const filterTerm = useProductsStore(state => state.filterTerm);

  const findAll = useProductsStore(state => state.findAll);
  const setFilterTerm = useProductsStore(state => state.setFilterTerm);
  const openActionModal = useProductsStore(state => state.openActionModal);

  // fetch all categories and units
  const getCategories = useCategoryStore(state => state.findAll);
  const getUnits = useUnitsStore(state => state.findAll);

  const hasReadPermission = useCheckPermission(
    ModulesRoles.DASHBOARD,
    ActionRoles.READ
  );

  useEffect(() => {
    if (hasReadPermission) {
      findAll();
      getCategories();
      getUnits();
    }
  }, []);

  const handleCreate = useCallback(() => {
    openActionModal("", "create");
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(e.target.value);
  };

  return (
    <main className="grid flex-1 items-start p-2 overflow-auto">
      <div className="flex items-center py-2 gap-2">
        <div className="ml-1">
          <Input
            type="text"
            value={filterTerm}
            onChange={handleFilterChange}
            placeholder="Búsqueda..."
            className="h-9 md:min-w-80" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ProductFilters />
          <Button size="sm" variant="outline" className="h-8 gap-1 hidden" disabled>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exportar
            </span>
          </Button>
          {useCheckPermission(ModulesRoles.DASHBOARD, ActionRoles.CREATE) && (
            <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
              <PlusCircle className="h-3.5 w-3.5 text-white" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
                Añadir Producto
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
            <CardDescription>
              Lista de productos registrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasReadPermission && (
              loading ? <DataTableSkeleton columns={columns} /> : (
                <FadeInComponent className="overflow-auto">
                  <DataTable columns={columns} data={filtered} />
                </FadeInComponent>
              )
            )}
          </CardContent>
          <CardFooter />
        </Card>

      </div>
      {isOpenDialog && <ProductDialog />}
    </main>
  )
}

export default ProductsPage