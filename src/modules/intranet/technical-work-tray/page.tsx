import { File, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components";
import { useCallback, useEffect, useMemo } from "react";
import { DataTable, DataTableSkeleton, FadeInComponent } from "@/shared";
import { columns } from "./components";
import { usePaperStore } from "./store/papers.store";
// import CustomerFilters from "./components/Filter/FilterDialog";
import PaperDialog from "./components/Dialog/PaperDialog";
import CommentsDialog from "./components/Comments/CommentsDialog";
import ConfirmDeleteComment from "./components/Comments/ConfirmDeleteComment";
import { useCategoryStore } from "@/modules/back-office/category/store/category.store";
import { useTopicStore } from "@/modules/back-office/topics/store/topic.store";
import { useSpeakerStore } from "@/modules/back-office/speakers/store/speaker.store";
import { StatePaper } from "@/models";
import { useAbstractStore } from "./store/abstract.store";
import dayjs from "dayjs";
// import utc from 'dayjs-plugin-utc';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// Configurar los plugins de Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function PapersManagementPage() {
  const loading = usePaperStore((state) => state.loading);
  const isOpenDialog = usePaperStore((state) => state.isOpenDialog);
  const isOpenCommentsDialog = usePaperStore(
    (state) => state.isOpenCommentsDialog
  );
  const isOpenConfirmDeleteComment = usePaperStore(
    (state) => state.isOpenConfirmDeleteComment
  );
  const filtered = usePaperStore((state) => state.filtered);
  const filterTerm = usePaperStore((state) => state.filterTerm);

  const findAll = usePaperStore((state) => state.findAll);
  const findAllCategories = useCategoryStore((state) => state.findAll);
  const findAllTopics = useTopicStore((state) => state.findAll);
  // const findDesignations = useSpeakerStore((state) => state.findProfessionalDesignations);
  const findCountries = useSpeakerStore((state) => state.findCountries);
  const setFilterTerm = usePaperStore((state) => state.setFilterTerm);
  const openActionModal = usePaperStore((state) => state.openActionModal);

  const setLimitDates = usePaperStore((state) => state.setLimitDates); // Limited dates for phases
  const limitDatePhaseOne = usePaperStore((state) => state.limitDatePhaseOne);
  const raw = localStorage.getItem("auth-intranet-store");
  let userId: number | undefined = undefined;

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      userId = parsed?.state?.user?.id;
    } catch (e) {
      console.error("Error parsing localStorage:", e);
    }
  }

  // const fetchAbstract = useAbstractStore((state) => state.fetchAbstract);
  // const abstract = useAbstractStore((state) => state.abstract);
  const findAbstract = useAbstractStore((state) => state.findAll);
  const abstractRecords = useAbstractStore((state) => state.data);
  // const abstractCount = abstract?.abstractRecord?.length ?? 0;
  const abstractCount = abstractRecords.length;

  // const setAbstract = useAbstractStore((state) => state.setAbstract);
  const userPapersCount = filtered?.length ?? 0;
  // const reachedMaxPapers = userPapersCount >= abstractCount;
  const reachedMaxPapers = userPapersCount >= abstractCount;

  const currentDate = dayjs().startOf("day");
  const endDate = useMemo(() => {
    if (!limitDatePhaseOne) return dayjs().startOf("day");
    return dayjs.tz(limitDatePhaseOne, "America/Lima").startOf("day");
  }, [limitDatePhaseOne]);
  const isValidDate: boolean = useMemo(() => {
    return currentDate.isSameOrBefore(endDate);
  }, [currentDate, endDate]);

  useEffect(() => {
    setLimitDates(); // Limited dates for phases
    findAll();
    findAllCategories();
    findAllTopics();
    findCountries();
    // console.log("USER ID:", userId);
    if (userId) {
      findAbstract(userId);
    }
    // findDesignations();
  }, []);

  const handleCreate = useCallback(() => {
    openActionModal(0, "create");
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(e.target.value);
  };

  const pendingCount = useMemo(() => {
    if (!filtered) return 0;
    return filtered.filter((paper) => paper.state === StatePaper.REGISTERED)
      .length;
  }, [filtered]);

  return (
    <main className="grid flex-1 items-start p-2 overflow-auto">
      {abstractRecords.length > 0 && (
        <Alert className="mb-3 border-green-400 bg-green-50 text-green-900">
          <AlertTitle>Files found</AlertTitle>

          <AlertDescription>
            {abstractRecords.map((abs: any, index: number) => (
              <div key={index} className="mb-3 p-2 border-b border-green-200">
                <p>
                  <strong>Code:</strong> {abs.codigo}
                </p>
                <p>
                  <strong>Name:</strong> {abs.name} {abs.lastname}
                </p>
                <p>
                  <strong>Title:</strong> {abs.title}
                </p>
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {pendingCount > 0 && (
        <Alert className="mb-3 border-yellow-400 bg-yellow-50 text-yellow-900">
          <AlertTitle>Pending submissions</AlertTitle>
          <AlertDescription>
            You have <strong>{pendingCount}</strong> technical paper
            {pendingCount > 1 ? "s" : ""} in <strong>PENDING</strong> status. To
            submit {pendingCount > 1 ? "them" : "it"}, click the{" "}
            <strong> ACTIONS </strong>
            button and select <strong>SUBMIT</strong> to finalize your
            submission. Then you will receive an email confirming that your
            submission was successfully sent.
          </AlertDescription>
        </Alert>
      )}

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
        <div className="ml-auto flex items-center gap-3">
          {/* Botón 1: Estilo Indigo (Azul violáceo suave) */}
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white"
            asChild
          >
            <a
              href="https://papers.wmc2026.org/formatos/paper_template.docx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Download Paper Template
              </span>
            </a>
          </Button>

          {/* Botón 2: Estilo Emerald (Verde esmeralda suave) */}
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white"
            asChild
          >
            <a
              href="https://papers.wmc2026.org/formatos/poster_template.pptx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Download Poster Template
              </span>
            </a>
          </Button>
          
          {/* <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white"
            asChild
          >
            <a
              href="https://papers.wmc2026.org/formatos/manual-uso-wmc-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                User Manual
              </span>
            </a>
          </Button> */}
          {/* <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white"
            asChild
          >
            <a
              href="https://papers.wmc2026.org/formatos/instructivo-wmc-2026-2.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Download Guidelines
              </span>
            </a>
          </Button> */}

          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 hidden"
            disabled
          >
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exporta
            </span>
          </Button>
          {isValidDate && (
            <Button
              size="sm"
              className="h-8 gap-1 bg-gradient-to-br from-[#00b3dc] via-[#0124e0] to-[#00023f] text-white"
              onClick={handleCreate}
              disabled={reachedMaxPapers}
            >
              <PlusCircle className="h-3.5 w-3.5 text-white " />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
                Upload Submission
              </span>
            </Button>
          )}
        </div>
      </div>
      {/* <CustomerFilters /> */}
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>My Submissions</CardTitle>
            <CardDescription>
              List of your submitted works.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <DataTableSkeleton columns={columns} />
            ) : (
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
  );
}

export default PapersManagementPage;
