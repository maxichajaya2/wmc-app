import { useCallback, useEffect } from "react"
import {
  File, PlusCircle,
  X
} from "lucide-react"
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, Button,
  Input,
  Badge
} from "@/components"
import { DataTable, DataTableSkeleton, FadeInComponent } from "@/shared"
import { useUsersStore } from "./store/users.store"
import { columns } from "./components"
import UserDialog from "./components/Dialog/UserDialog"
import UserFilters from "./components/Filter/UserFilters"
import { useCheckPermission } from "@/utils"
import { ActionRoles, ModulesRoles } from "@/constants"
import { useRoleStore } from "../roles/store/roles.store"
import { useCategoryStore } from "../category/store/category.store"

function UsersPage() {
  const selectedRoles = useUsersStore(state => state.selectedRoles)
  const loading = useUsersStore(state => state.loading)
  const isOpenDialog = useUsersStore(state => state.isOpenDialog)
  const filtered = useUsersStore(state => state.filtered)
  const filterTerm = useUsersStore(state => state.filterTerm)
  const findAll = useUsersStore(state => state.findAll)
  const findCategories = useCategoryStore(state => state.findAll)
  const setFilterTerm = useUsersStore(state => state.setFilterTerm)
  const setSelectedRoles = useUsersStore(state => state.setSelectedRoles)
  const clearFilters = useUsersStore(state => state.clearFilters)
  const openActionModal = useUsersStore(state => state.openActionModal)
  const roles = useRoleStore(state => state.data)

  const hasReadPermission = useCheckPermission(
    ModulesRoles.USERS,
    ActionRoles.READ
  );

  useEffect(() => {
    if (hasReadPermission) {
      findAll();
      findCategories();
    }

    return () => {
      clearFilters();
    };
  }, []);

  const handleCreate = useCallback(() => {
    openActionModal(0, 'create');
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
          <UserFilters />
          <Button size="sm" variant="outline" className="h-8 gap-1 hidden" disabled>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exportar
            </span>
          </Button>
          {useCheckPermission(ModulesRoles.USERS, ActionRoles.CREATE) && (
            <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
              <PlusCircle className="h-3.5 w-3.5 text-white" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
                Añadir Usuario
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <motion.div
          initial={{ height: '0px' }}
          animate={{ height: selectedRoles.length > 0 ? '30px' : '0px' }}
          transition={{ duration: 0.5 }}
          className="my-2 px-1 flex gap-2 overflow-auto scrollbar-hide">
          {selectedRoles.map((role) => (
            <Badge
              key={role}
              className="flex justify-between gap-[3px] md:gap-2 items-center min-w-32 md:min-w-max py-2">
              <span className="line-clamp-1 text-white">{roles.find(r => r.id == +role)?.name || 'undefined'}</span>
              <Button
                variant="ghost"
                className="h-3 w-3 p-0 m-0 bg-white text-primary"
                onClick={() => {
                  setSelectedRoles(selectedRoles.filter((r) => r !== role));
                }}
              >
                <X className="h-2 w-2" strokeWidth={5} />
              </Button>
            </Badge>
          ))}
        </motion.div>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>
              Listado de todos los usuarios registrados en el sistema.
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
      {isOpenDialog && <UserDialog />}
    </main>
  )
}

export default UsersPage