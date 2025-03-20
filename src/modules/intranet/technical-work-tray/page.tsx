
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
import { usePaperStore } from "./store/papers.store"
import CustomerFilters from "./components/Filter/FilterDialog"
import PaperDialog from "./components/Dialog/PaperDialog"
import CommentsDialog from "./components/Comments/CommentsDialog"
import ConfirmDeleteComment from "./components/Comments/ConfirmDeleteComment"
import { useCategoryStore } from "@/modules/back-office/category/store/category.store"
import { useTopicStore } from "@/modules/back-office/topics/store/topic.store"
import { useSpeakerStore } from "@/modules/back-office/speakers/store/speaker.store"

function PapersManagementPage() {
  const loading = usePaperStore(state => state.loading);
  const isOpenDialog = usePaperStore(state => state.isOpenDialog);
  const isOpenCommentsDialog = usePaperStore((state) => state.isOpenCommentsDialog)
  const isOpenConfirmDeleteComment = usePaperStore((state) => state.isOpenConfirmDeleteComment)
  const filtered = usePaperStore(state => state.filtered);
  const filterTerm = usePaperStore(state => state.filterTerm);

  const findAll = usePaperStore(state => state.findAll);
  const findAllCategories = useCategoryStore(state => state.findAll);
  const findAllTopics = useTopicStore(state => state.findAll);
  const findCountries = useSpeakerStore(state => state.findCountries);
  const setFilterTerm = usePaperStore(state => state.setFilterTerm);
  const openActionModal = usePaperStore(state => state.openActionModal);


  useEffect(() => {
    findAll()
    findAllCategories()
    findAllTopics()
    findCountries()
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
          <Button size="sm" variant="outline" className="h-8 gap-1 hidden" disabled>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exportar
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
            <PlusCircle className="h-3.5 w-3.5 text-white" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
              Añadir Trabajo Técnico
            </span>
          </Button>
        </div>
      </div>
      <CustomerFilters />
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Trabajos Técnicos</CardTitle>
            <CardDescription>
              Lista de trabajos técnicos registrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <DataTableSkeleton columns={columns} /> : (
              <FadeInComponent className="overflow-auto">
                <DataTable columns={columns} data={filtered} />
              </FadeInComponent>
            )}
          </CardContent>
          <CardFooter />
        </Card>

      </div>
      {isOpenDialog && <PaperDialog />}
      {isOpenCommentsDialog && <CommentsDialog />}
      {isOpenConfirmDeleteComment && <ConfirmDeleteComment />}
    </main>
  )
}

export default PapersManagementPage