
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
import { useCashBoxesStore } from "./store/cash-boxes.store"
import CashBoxFilters from "./components/Filter/CashBoxFilters"
import CashBoxDialog from "./components/Dialog/CashBoxDialog"
import { useUsersStore } from "../users/store/users.store"
import { useSubsidiaryStore } from "../subsidiary/store/subsidiary.store"
import ChangeStatusBoxDialog from "./components/Dialog/ChangeStatusBoxDialog"
import { ActionRoles, ModulesRoles } from "@/constants"
import { useCheckPermission } from "@/utils"

function CashBoxesPage() {
  const loading = useCashBoxesStore(state => state.loading);
  const isOpenDialog = useCashBoxesStore(state => state.isOpenDialog);
  const filtered = useCashBoxesStore(state => state.filtered);
  const filterTerm = useCashBoxesStore(state => state.filterTerm);
  const isOpenDialogChangeStatus = useCashBoxesStore(state => state.isOpenDialogChangeStatus);
  const findAll = useCashBoxesStore(state => state.findAll);
  const setFilterTerm = useCashBoxesStore(state => state.setFilterTerm);
  const openActionModal = useCashBoxesStore(state => state.openActionModal);

  // fetch all users and subsidiaries
  const findUsers = useUsersStore(state => state.findAll);
  // sucursales
  const findSubsidiaries = useSubsidiaryStore(state => state.findAll);

  const hasReadPermission = useCheckPermission(
    ModulesRoles.DASHBOARD,
    ActionRoles.READ
  );

  useEffect(() => {
    if (hasReadPermission) {
      findAll();
      findUsers();
      findSubsidiaries();
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
          <CashBoxFilters />
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
                Añadir Caja
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Cajas</CardTitle>
            <CardDescription>
              Lista de Cajas registradas.
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
      {isOpenDialog && <CashBoxDialog />}
      {isOpenDialogChangeStatus && <ChangeStatusBoxDialog />}
    </main>
  )
}

export default CashBoxesPage