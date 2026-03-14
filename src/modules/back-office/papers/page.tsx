import { FileSpreadsheet, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/components";
import { useCallback, useEffect } from "react";
import { DataTable, DataTableSkeleton, FadeInComponent } from "@/shared";
import { columns } from "./components/Table/columns";
import { usePaperStore } from "./store/papers.store";
import CustomerFilters from "./components/Filter/FilterDialog";
import PaperDialog from "./components/Dialog/PaperDialog";
import { useCheckPermission } from "@/utils";
import { ActionRoles, ModulesRoles } from "@/constants";
import { useTopicStore } from "../topics/store/topic.store";
import { useUserWebStore } from "../users-web/store/users-web.store";
import CommentsDialog from "./components/Comments/CommentsDialog";
import { useSpeakerStore } from "../speakers/store/speaker.store";
import { useCategoryStore } from "../category/store/category.store";
import { useUsersStore } from "../users/store/users.store";
import ConfirmDeleteComment from "./components/Comments/ConfirmDeleteComment";

function PapersManagementPage() {
  const loading = usePaperStore((state) => state.loading);
  const isOpenDialog = usePaperStore((state) => state.isOpenDialog);
  const isOpenCommentsDialog = usePaperStore(
    (state) => state.isOpenCommentsDialog,
  );
  const isOpenConfirmDeleteComment = usePaperStore(
    (state) => state.isOpenConfirmDeleteComment,
  );
  const filtered = usePaperStore((state) => state.filtered);
  const filterTerm = usePaperStore((state) => state.filterTerm);
  const getReport = usePaperStore((state) => state.getReport);

  const findAll = usePaperStore((state) => state.findAll);
  const findAllCategories = useCategoryStore((state) => state.findAll);
  const findAllTopics = useTopicStore((state) => state.findAll);
  const findCountries = useSpeakerStore((state) => state.findCountries);
  const findAllUsers = useUsersStore((state) => state.findAll);
  const findAllUserWeb = useUserWebStore((state) => state.findAll);
  const setFilterTerm = usePaperStore((state) => state.setFilterTerm);
  const openActionModal = usePaperStore((state) => state.openActionModal);

  const hasReadPermission = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.READ,
  );

  useEffect(() => {
    if (hasReadPermission) {
      findAll({});
      findAllCategories();
      findAllTopics();
      findAllUsers();
      findAllUserWeb();
      findCountries();
    }
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
            className="h-9 md:min-w-80"
          />
        </div>
        <div className="ml-auto flex items-center justify-between w-full gap-2">
          <Button
            size="sm"
            className="h-8 gap-1 bg-green-500 hover:bg-green-400"
            type="button"
            onClick={async () => {
              await getReport();
            }}
            disabled={loading}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-base">
              Export
            </span>
          </Button>
          {useCheckPermission(
            ModulesRoles.TECHINICAL_WORKS,
            ActionRoles.CREATE,
          ) && (
            <Button
              size="sm"
              className="h-8 gap-1 bg-gradient-to-br from-[#00b3dc] via-[#0124e0] to-[#00023f]"
              onClick={handleCreate}
            >
              <PlusCircle className="h-3.5 w-3.5 text-white " />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
                Add New Paper
              </span>
            </Button>
          )}
        </div>
      </div>

      <CustomerFilters />
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>My Submissions</CardTitle>
            <CardDescription>List of your submitted works.</CardDescription>
          </CardHeader>
          <CardContent>
            {hasReadPermission &&
              (loading && filtered.length === 0 ? (
                <DataTableSkeleton columns={columns} />
              ) : (
                <FadeInComponent className="overflow-auto">
                  <DataTable columns={columns} data={filtered} />
                </FadeInComponent>
              ))}
          </CardContent>
          <CardFooter />
        </Card>
      </div>
      {isOpenDialog && <PaperDialog />}
      {isOpenCommentsDialog && <CommentsDialog />}
      {isOpenConfirmDeleteComment && <ConfirmDeleteComment />}
    </main>
  );
}

export default PapersManagementPage;
