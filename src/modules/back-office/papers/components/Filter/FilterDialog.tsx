import type React from "react";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from "@/components";
import {
  MapProcessPaper,
  MapStatePaper,
  PrimaryRoles,
  ProcessPaper,
  StatePaper,
} from "@/models";
import { usePaperStore } from "../../store/papers.store";
import { useTopicStore } from "@/modules/back-office/topics/store/topic.store";
import { useUsersStore } from "@/modules/back-office/users/store/users.store";
import { useCategoryStore } from "@/modules/back-office/category/store/category.store";

// DAYJS
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { DateClass } from "@/lib";
import { useSessionBoundStore } from "@/modules/back-office/auth/store";
import { useEffect } from "react";

// Configurar los plugins de Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const states: StatePaper[] = [
  StatePaper.RECEIVED,
  StatePaper.SENT,
  StatePaper.ASSIGNED,
  StatePaper.UNDER_REVIEW,
  StatePaper.APPROVED,
  StatePaper.DISMISSED,
];
const processes: ProcessPaper[] = [
  ProcessPaper.PRESELECCIONADO,
  ProcessPaper.SELECCIONADO,
];

function CustomerFilters() {
  const {
    filterTerm,
    filterId,
    dateRange,
    selectedTopic,
    selectedCategory,
    selectedLeader,
    selectedReviewer,
    selectedState,
    selectedProcess,
    setFilterTerm,
    setFilterId,
    setDateRange,
    setSelectedTopic,
    setSelectedCategory,
    setSelectedLeader,
    setSelectedReviewer,
    setSelectedProcess,
    setSelectedState,
    updateFiltered,
    loading,
    findAll,
  } = usePaperStore();

  const user = useSessionBoundStore((state) => state.session?.user);
  const categories = useCategoryStore((state) => state.filtered);
  const topics = useTopicStore((state) => state.filtered);
  const filteredUsers = useUsersStore((state) => state.filtered);
  const loadingUsers = useUsersStore((state) => state.loading);

  const reviewers = filteredUsers.filter(
    (user) => user.role.id === PrimaryRoles.REVIEWER,
  );
  const leaders = filteredUsers.filter(
    (user) => user.role.id === PrimaryRoles.LEADER,
  );

  // 1. FILTRAR DUPLICADOS por NOMBRE (para ignorar IDs diferentes con el mismo texto)
  const uniqueCategories = categories.filter(
    (v, i, a) => a.findIndex((t) => t.name.trim() === v.name.trim()) === i,
  );
  const uniqueTopics = topics.filter(
    (v, i, a) => a.findIndex((t) => t.name.trim() === v.name.trim()) === i,
  );

  useEffect(() => {
    if (!user || !leaders || !reviewers) return;
    if (selectedLeader || selectedReviewer) return;
    if (loadingUsers || loading) return;

    if (user.role.id === PrimaryRoles.LEADER) {
      const leader = leaders.find((leader) => leader.id === user.id);
      if (leader) setSelectedLeader(leader);
    } else if (user.role.id === PrimaryRoles.REVIEWER) {
      const reviewer = reviewers.find((reviewer) => reviewer.id === user.id);
      if (reviewer) setSelectedReviewer(reviewer);
    }
  }, [
    user,
    leaders,
    reviewers,
    selectedLeader,
    selectedReviewer,
    setSelectedLeader,
    setSelectedReviewer,
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(e.target.value);
    updateFiltered();
  };

  const handleSearchId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterId(e.target.value);
    updateFiltered();
  };

  const handleDateChange = (date: Date | undefined, type: "start" | "end") => {
    if (date) {
      const dateToFormat = dayjs(date)
        .tz("America/Bogota")
        .format(DateClass.FORMAT_INPUT_SHORT);
      setDateRange({
        ...dateRange,
        [type]: DateClass.DateToFormat(
          dateToFormat,
          DateClass.FORMAT_INPUT_SHORT,
        ),
      });
      updateFiltered();
    }
  };

  const resetDateRange = () => {
    setDateRange({ start: "", end: "" });
    updateFiltered();
  };

  const formatDate = (date: string) => {
    return dayjs(date)
      .tz("America/Bogota")
      .format(DateClass.FORMAT_INPUT_SHORT);
  };

  const viewAllReviewers = () => {
    setFilterId("");
    setFilterTerm("");
    setDateRange({ start: "", end: "" });
    setSelectedCategory([] as any);
    setSelectedTopic([] as any);
    setSelectedState(null);
    setSelectedProcess(null);
    setSelectedLeader(null);
    setSelectedReviewer(null);
    findAll({ viewAll: true });
    updateFiltered();
  };

  // --- LÓGICA DE SELECCIÓN MÚLTIPLE ---

  // Helpers para convertir el estado actual en array (por si en el store aún es un objeto único)
  const currentCategories = Array.isArray(selectedCategory)
    ? selectedCategory
    : selectedCategory
      ? [selectedCategory]
      : [];
  const currentTopics = Array.isArray(selectedTopic)
    ? selectedTopic
    : selectedTopic
      ? [selectedTopic]
      : [];

  const handleCategorySelect = (category: any) => {
    // Validar por nombre en lugar de id
    const exists = currentCategories.find((c) => c.name === category.name);
    const newSelection = exists
      ? currentCategories.filter((c) => c.name !== category.name)
      : [...currentCategories, category];

    // Usamos "as any" para evitar el error de TypeScript al guardar un array en un campo de objeto único
    setSelectedCategory(newSelection as any);
    updateFiltered();
  };

  const handleTopicSelect = (topic: any) => {
    // Validar por nombre en lugar de id
    const exists = currentTopics.find((t) => t.name === topic.name);
    const newSelection = exists
      ? currentTopics.filter((t) => t.name !== topic.name)
      : [...currentTopics, topic];

    // Usamos "as any" para evitar el error de TypeScript al guardar un array en un campo de objeto único
    setSelectedTopic(newSelection as any);
    updateFiltered();
  };

  // Renderizadores de texto para los botones múltiples
  const renderCategoryText = () => {
    if (currentCategories.length === 0) return "Choose a category";
    if (currentCategories.length > 2)
      return `${currentCategories.length} categories selected`;
    return currentCategories.map((c) => c.name).join(", ");
  };

  const renderTopicText = () => {
    if (currentTopics.length === 0) return "Choose a topic";
    if (currentTopics.length > 2)
      return `${currentTopics.length} topics selected`;
    return currentTopics.map((t) => t.name).join(", ");
  };

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white shadow rounded-lg mb-4">
      <Input
        placeholder="Search by nro. code"
        value={filterId}
        onChange={handleSearchId}
        className="w-64"
      />
      <Input
        placeholder="Search by name or document"
        value={filterTerm}
        onChange={handleSearch}
        className="w-64"
      />

      {/* Rango de Fechas */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.start ? (
              dateRange.end ? (
                <>
                  {formatDate(dateRange.start)} | {formatDate(dateRange.end)}
                </>
              ) : (
                <>{formatDate(dateRange.start)}</>
              )
            ) : (
              <span>Select a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={
              dateRange.start ? dayjs(dateRange.start).toDate() : undefined
            }
            selected={{
              from: dateRange.start
                ? dayjs(dateRange.start).toDate()
                : undefined,
              to: dateRange.end ? dayjs(dateRange.end).toDate() : undefined,
            }}
            onSelect={(range) => {
              if (range?.from) handleDateChange(range.from, "start");
              if (range?.to) handleDateChange(range.to, "end");
            }}
            numberOfMonths={2}
          />
          <div className="flex items-center justify-between p-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={resetDateRange}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Categories Popover (Múltiple) */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            <span className="truncate">{renderCategoryText()}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search for a category..." />
            <CommandList>
              <CommandEmpty>Category not found</CommandEmpty>
              <CommandGroup>
                {uniqueCategories.map((category) => {
                  // Validación por nombre
                  const isSelected = currentCategories.some(
                    (c) => c.name === category.name,
                  );
                  return (
                    <CommandItem
                      key={category.id}
                      onSelect={() => handleCategorySelect(category)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {category.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Topics Popover (Múltiple) */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            <span className="truncate">{renderTopicText()}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search for a topic..." />
            <CommandList>
              <CommandEmpty>Topic not found</CommandEmpty>
              <CommandGroup>
                {uniqueTopics.map((topic) => {
                  // Validación por nombre
                  const isSelected = currentTopics.some(
                    (t) => t.name === topic.name,
                  );
                  return (
                    <CommandItem
                      key={topic.id}
                      onSelect={() => handleTopicSelect(topic)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {topic.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* States Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            {selectedState ? MapStatePaper[selectedState] : "Select a status"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search for a status..." />
            <CommandList>
              <CommandEmpty>Status not found</CommandEmpty>
              <CommandGroup>
                {states.map((state) => (
                  <CommandItem
                    key={state}
                    onSelect={() => {
                      setSelectedState(selectedState === state ? null : state);
                      updateFiltered();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedState === state ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {MapStatePaper[state]}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Processes Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            {selectedProcess
              ? MapProcessPaper[selectedProcess as ProcessPaper]
              : "Choose a process"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search for a process..." />
            <CommandList>
              <CommandEmpty>Process not found</CommandEmpty>
              <CommandGroup>
                {processes.map((state) => (
                  <CommandItem
                    key={state}
                    onSelect={() => {
                      setSelectedProcess(
                        selectedProcess === state ? null : state,
                      );
                      updateFiltered();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedProcess === state ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {MapProcessPaper[state]}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="secondary"
        onClick={viewAllReviewers}
        className="w-[200px]"
      >
        View all
      </Button>
    </div>
  );
}

export default CustomerFilters;
