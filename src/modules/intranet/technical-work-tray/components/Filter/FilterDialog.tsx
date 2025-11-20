// import type React from "react";
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
  // Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from "@/components";
import { MapProcessPaper, ProcessPaper } from "@/models";
import { usePaperStore } from "../../store/papers.store";
import { useTopicStore } from "@/modules/back-office/topics/store/topic.store";
import { useCategoryStore } from "@/modules/back-office/category/store/category.store";

// DAYJS
import dayjs from "dayjs";
// import utc from 'dayjs-plugin-utc';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { DateClass } from "@/lib";
// import { formatDate } from '../../../../../utils/format-date';
// Configurar los plugins de Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// const states: StatePaper[] = [
//     StatePaper.REGISTERED,
//     StatePaper.RECEIVED,
//     StatePaper.SENT,
//     StatePaper.ASSIGNED,
//     StatePaper.UNDER_REVIEW,
//     StatePaper.APPROVED,
//     StatePaper.DISMISSED,

// ]
const processes: ProcessPaper[] = [
  ProcessPaper.PRESELECCIONADO,
  ProcessPaper.SELECCIONADO,
  // ProcessPaper.ASIGNADO,
];

function CustomerFilters() {
  const {
    // filterTerm,
    dateRange,
    selectedTopic,
    selectedCategory,
    // selectedState,
    // setFilterTerm,
    setDateRange,
    setSelectedTopic,
    setSelectedCategory,
    // setSelectedState,
    updateFiltered,
    selectedProcess,
    setSelectedProcess,
  } = usePaperStore();

  const categories = useCategoryStore((state) => state.filtered);
  const topics = useTopicStore((state) => state.filtered);

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterTerm(e.target.value);
  //   updateFiltered();
  // };

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

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white shadow rounded-lg mb-4">
      {/* <Input placeholder="Busca por nombre o documento" value={filterTerm} onChange={handleSearch} className="w-64" /> */}

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
              <span>Select submission date range</span>
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
            ></Button>
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
            {selectedCategory ? selectedCategory.name : "Select a Category"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search a category..." />
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
            {selectedTopic ? selectedTopic.name : "Select a Topic"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search a topic..." />
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
                    <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                        {selectedState ? MapStatePaper[selectedState] : "Selecciona un estado"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Busca un estado..." />
                        <CommandList>
                            <CommandEmpty>Estado no encontrado</CommandEmpty>
                            <CommandGroup>
                                {states.map((state) => (
                                    <CommandItem
                                        key={state}
                                        onSelect={() => {
                                            console.log({ state })
                                            setSelectedState(selectedState === state ? null : state)
                                            updateFiltered()
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", selectedState === state ? "opacity-100" : "opacity-0")} />
                                        {MapStatePaperForUser[state]}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover> */}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            {selectedProcess
              ? MapProcessPaper[selectedProcess as ProcessPaper]
              : "Select a Stage"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Busca un proceso..." />
            <CommandList>
              <CommandEmpty>Proceso no encontrado</CommandEmpty>
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
    </div>
  );
}

export default CustomerFilters;
