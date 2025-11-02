
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
import { useTopicStore } from "./store/topic.store"
import CustomerFilters from "./components/Filter/FilterDialog"
import TopicDialog from "./components/Dialog/TopicDialog"
import { useCheckPermission } from "@/utils"
import { ActionRoles, ModulesRoles } from "@/constants"
// import { useUserWebStore } from "../users-web/store/users-web.store"
import ReviewersDialog from "./components/Dialog/ReviewersDialog"
import { useCategoryStore } from "../category/store/category.store"

function TopicsManagementPage() {
  const loading = useTopicStore(state => state.loading);
  const isOpenDialog = useTopicStore(state => state.isOpenDialog);
  const isOpenDialogUsers = useTopicStore(state => state.isOpenDialogUsers);
  const filtered = useTopicStore(state => state.filtered);
  const filterTerm = useTopicStore(state => state.filterTerm);

  const findAll = useTopicStore(state => state.findAll);
  const findCategories = useCategoryStore(state => state.findAll);
  // const findAllUserWeb = useUserWebStore(state => state.findAll);
  const setFilterTerm = useTopicStore(state => state.setFilterTerm);
  const openActionModal = useTopicStore(state => state.openActionModal);


  const hasReadPermission = useCheckPermission(
    ModulesRoles.TOPICS,
    ActionRoles.READ
  );

  useEffect(() => {
    if (hasReadPermission) {
      findAll()
      // findAllUserWeb();
      findCategories();
    };
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
        <div className="ml-1 hidden">
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
          {useCheckPermission(ModulesRoles.TOPICS, ActionRoles.CREATE) && (
            <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
              <PlusCircle className="h-3.5 w-3.5 text-white" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
                Añadir Tema
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Temas</CardTitle>
            <CardDescription>
              Lista de temas registrados.
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
      {isOpenDialog && <TopicDialog />}
      {isOpenDialogUsers && <ReviewersDialog />}
    </main>
  )
}

export default TopicsManagementPage