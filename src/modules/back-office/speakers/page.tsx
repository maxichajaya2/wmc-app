
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
import { useSpeakerStore } from "./store/speaker.store"
import CustomerFilters from "./components/Filter/FilterDialog"
import SpeakerDialog from "./components/Dialog/SpeakerDialog"
import { useCheckPermission } from "@/utils"
import { ActionRoles, ModulesRoles } from "@/constants"
import { useSpeakerTypeStore } from "../speaker-type/store/speaker-type.store"

function SpeakersManagementPage() {
  const loading = useSpeakerStore(state => state.loading);
  const isOpenDialog = useSpeakerStore(state => state.isOpenDialog);
  const filtered = useSpeakerStore(state => state.filtered);
  const filterTerm = useSpeakerStore(state => state.filterTerm);

  const findAll = useSpeakerStore(state => state.findAll);
  const findCountries = useSpeakerStore(state => state.findCountries);
  const findSpeakerTypes = useSpeakerTypeStore(state => state.findAll);
  const setFilterTerm = useSpeakerStore(state => state.setFilterTerm);
  const openActionModal = useSpeakerStore(state => state.openActionModal);


  const hasReadPermission = useCheckPermission(
    ModulesRoles.DASHBOARD,
    ActionRoles.READ
  );

  useEffect(() => {
    if (hasReadPermission) {
      findAll()
      findCountries()
      findSpeakerTypes()
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
          {useCheckPermission(ModulesRoles.DASHBOARD, ActionRoles.CREATE) && (
            <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
              <PlusCircle className="h-3.5 w-3.5 text-white" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
                Añadir Conferencista
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Conferencista</CardTitle>
            <CardDescription>
              Lista de Conferencistas registrados.
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
      {isOpenDialog && <SpeakerDialog />}
    </main>
  )
}

export default SpeakersManagementPage