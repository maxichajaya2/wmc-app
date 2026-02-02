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
// import utc from 'dayjs-plugin-utc';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { DateClass } from "@/lib";
import { useSessionBoundStore } from "@/modules/back-office/auth/store";
import { useEffect } from "react";
// import { formatDate } from '../../../../../utils/format-date';
// Configurar los plugins de Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const states: StatePaper[] = [
  // StatePaper.REGISTERED,
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
  // ProcessPaper.ASIGNADO,
];

function CustomerFilters() {
  const {
    filterTerm,
    dateRange,
    selectedTopic,
    selectedCategory,
    selectedLeader,
    selectedReviewer,
    selectedState,
    selectedProcess,
    setFilterTerm,
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
    (user) => user.role.id === PrimaryRoles.REVIEWER
  );
  const leaders = filteredUsers.filter(
    (user) => user.role.id === PrimaryRoles.LEADER
  );

  // Efecto, si el usuario es un líder, entonces selecciona el líder por defecto, si es un revisor, selecciona el revisor por defecto
  useEffect(() => {
    if (!user || !leaders || !reviewers) return; // Si ya hay un líder o revisor seleccionado, no hacer nada
    if (selectedLeader || selectedReviewer) return; // Si ya hay un líder o revisor seleccionado, no hacer nada
    if (loadingUsers || loading) return;
    if (user.role.id === PrimaryRoles.LEADER) {
      const leader = leaders.find((leader) => leader.id === user.id);
      if (leader) {
        setSelectedLeader(leader);
      }
    } else if (user.role.id === PrimaryRoles.REVIEWER) {
      const reviewer = reviewers.find((reviewer) => reviewer.id === user.id);
      if (reviewer) {
        setSelectedReviewer(reviewer);
      }
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

  const handleDateChange = (date: Date | undefined, type: "start" | "end") => {
    if (date) {
      const dateToFormat = dayjs(date)
        .tz("America/Bogota")
        .format(DateClass.FORMAT_INPUT_SHORT);
      setDateRange({
        ...dateRange,
        [type]: DateClass.DateToFormat(
          dateToFormat,
          DateClass.FORMAT_INPUT_SHORT
        ),
      });
      updateFiltered();
    }
  };

  // funcion para resetear el filtro de fecha
  const resetDateRange = () => {
    setDateRange({ start: "", end: "" });
    updateFiltered();
  };

  const formatDate = (date: string) => {
    return dayjs(date)
      .tz("America/Bogota")
      .format(DateClass.FORMAT_INPUT_SHORT);
  };

  // view all reviewers
  const viewAllReviewers = () => {
    findAll({ viewAll: true });
    updateFiltered();
  };

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white shadow rounded-lg mb-4">
      <Input
        placeholder="Search by name or document"
        value={filterTerm}
        onChange={handleSearch}
        className="w-64"
      />

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
              onClick={() => {
                resetDateRange();
              }}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            {selectedCategory ? selectedCategory.name : "Choose a category"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search for a category..." />
            <CommandList>
              <CommandEmpty>Category not found</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => {
                      setSelectedCategory(
                        selectedCategory?.id === category.id ? null : category
                      );
                      updateFiltered();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTopic?.id === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            {selectedTopic ? selectedTopic.name : "Choose a topic"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search for a topic..." />
            <CommandList>
              <CommandEmpty>Topic not found</CommandEmpty>
              <CommandGroup>
                {topics.map((topic) => (
                  <CommandItem
                    key={topic.id}
                    onSelect={() => {
                      setSelectedTopic(
                        selectedTopic?.id === topic.id ? null : topic
                      );
                      updateFiltered();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTopic?.id === topic.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {topic.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            {selectedLeader ? `${selectedLeader.name}` : "Select a leader"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search for a leader..." />
            <CommandList>
              <CommandEmpty>Leader not found</CommandEmpty>
              <CommandGroup>
                {leaders.map((leader) => (
                  <CommandItem
                    key={leader.id}
                    onSelect={() => {
                      setSelectedLeader(
                        selectedLeader?.id === leader.id ? null : leader
                      );
                      updateFiltered();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedLeader?.id === leader.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {`${leader.name}`}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover> */}

      {/* <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
            disabled={false}
          >
            {selectedReviewer
              ? `${selectedReviewer.name}`
              : "Select a reviewer"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search for a reviewer..." />
            <CommandList>
              <CommandEmpty>Reviewer not found</CommandEmpty>
              <CommandGroup>
                {reviewers.map((reviewer) => (
                  <CommandItem
                    key={reviewer.id}
                    onSelect={() => {
                      setSelectedReviewer(
                        selectedReviewer?.id === reviewer.id ? null : reviewer
                      );
                      updateFiltered();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedReviewer?.id === reviewer.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {`${reviewer.name}`}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover> */}

      {/* Ver todos los revisores */}
      
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
                      console.log({ state });
                      setSelectedState(selectedState === state ? null : state);
                      updateFiltered();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedState === state ? "opacity-100" : "opacity-0"
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
                      console.log({ state });
                      setSelectedProcess(
                        selectedProcess === state ? null : state
                      );
                      updateFiltered();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedProcess === state ? "opacity-100" : "opacity-0"
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
