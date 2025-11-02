
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
import { useRoleStore } from "./store/roles.store"
import CustomerFilters from "./components/Filter/RolesFilters"
import RolesDialog from "./components/Dialog/RolesDialog"
import { useCheckPermission } from "@/utils"
import { ActionRoles, ModulesRoles } from "@/constants"

function RolesPage() {
  const loading = useRoleStore(state => state.loading);
  const isOpenDialog = useRoleStore(state => state.isOpenDialog);
  const filtered = useRoleStore(state => state.filtered);
  const filterTerm = useRoleStore(state => state.filterTerm);

  const findAll = useRoleStore(state => state.findAll);
  const setFilterTerm = useRoleStore(state => state.setFilterTerm);
  const openActionModal = useRoleStore(state => state.openActionModal);


  const hasReadPermission = useCheckPermission(
    ModulesRoles.ROLES,
    ActionRoles.READ
  );

  useEffect(() => {
    if (hasReadPermission) {
      findAll()};
  }, []);

  const handleCreate = useCallback(() => {
    openActionModal(0, "create");
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
          <CustomerFilters />
          <Button size="sm" variant="outline" className="h-8 gap-1 hidden" disabled>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exportar
            </span>
          </Button>
          {useCheckPermission(ModulesRoles.ROLES, ActionRoles.CREATE) && (
            <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
              <PlusCircle className="h-3.5 w-3.5 text-white" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
                Añadir Rol
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>
              Lista de roles registrados.
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
      {isOpenDialog && <RolesDialog />}
    </main>
  )
}

export default RolesPage