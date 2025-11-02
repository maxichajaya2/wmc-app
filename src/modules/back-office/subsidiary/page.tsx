
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
import { useSubsidiaryStore } from "./store/subsidiary.store"
import SubsidiaryFilters from "./components/Filter/SubsidiaryFilters"
import SubsidiaryDialog from "./components/Dialog/SubsidiaryDialog"
import { useCheckPermission } from "@/utils"
import { ActionRoles, ModulesRoles } from "@/constants"

function SubsidiaryManagementPage() {
  const loading = useSubsidiaryStore(state => state.loading);
  const isOpenDialog = useSubsidiaryStore(state => state.isOpenDialog);
  const filtered = useSubsidiaryStore(state => state.filtered);
  const filterTerm = useSubsidiaryStore(state => state.filterTerm);

  const findAll = useSubsidiaryStore(state => state.findAll);
  const setFilterTerm = useSubsidiaryStore(state => state.setFilterTerm);
  const openActionModal = useSubsidiaryStore(state => state.openActionModal);

  const hasReadPermission = useCheckPermission(
    ModulesRoles.DASHBOARD,
    ActionRoles.READ
  );

  useEffect(() => {
    if (hasReadPermission) {
      findAll();
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
          <SubsidiaryFilters />
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
                Añadir Sucursal
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Sucursales</CardTitle>
            <CardDescription>
              Lista de Sucursales registradas.
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
      {isOpenDialog && <SubsidiaryDialog />}
    </main>
  )
}

export default SubsidiaryManagementPage