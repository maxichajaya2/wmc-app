import type React from "react"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Button, Input, Popover, PopoverContent, PopoverTrigger, Calendar } from "@/components"
import { MapStatePaper, StatePaper } from "@/models"
import { usePaperStore } from "../../store/papers.store"
import { useTopicStore } from "@/modules/back-office/topics/store/topic.store"
import { useCategoryStore } from "@/modules/back-office/category/store/category.store"


const states: StatePaper[] = [
    StatePaper.REGISTERED,
    StatePaper.RECEIVED,
    StatePaper.SENT,
    StatePaper.ASSIGNED,
    StatePaper.UNDER_REVIEW,
    StatePaper.APPROVED,
    StatePaper.DISMISSED,

]

function CustomerFilters() {
    const {
        filterTerm,
        dateRange,
        selectedTopic,
        selectedCategory,
        selectedState,
        setFilterTerm,
        setDateRange,
        setSelectedTopic,
        setSelectedCategory,
        setSelectedState,
        updateFiltered,
    } = usePaperStore()

    const categories = useCategoryStore(state => state.filtered);
    const topics = useTopicStore(state => state.filtered);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterTerm(e.target.value)
        updateFiltered()
    }

    const handleDateChange = (date: Date | undefined, type: "start" | "end") => {
        if (date) {
            setDateRange({ ...dateRange, [type]: format(date, "yyyy-MM-dd") })
            updateFiltered()
        }
    }

    return (
        <div className="flex flex-wrap gap-4 items-center p-4 bg-white shadow rounded-lg mb-4">
            <Input placeholder="Busca por nombre o documento" value={filterTerm} onChange={handleSearch} className="w-64" />

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.start ? (
                            dateRange.end ? (
                                <>
                                    {format(new Date(dateRange.start), "LLL dd, y")} - {format(new Date(dateRange.end), "LLL dd, y")}
                                </>
                            ) : (
                                format(new Date(dateRange.start), "LLL dd, y")
                            )
                        ) : (
                            <span>Selecciona un rango de fechas</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.start ? new Date(dateRange.start) : new Date()}
                        selected={{
                            from: dateRange.start ? new Date(dateRange.start) : undefined,
                            to: dateRange.end ? new Date(dateRange.end) : undefined,
                        }}
                        onSelect={(range) => {
                            if (range?.from) handleDateChange(range.from, "start")
                            if (range?.to) handleDateChange(range.to, "end")
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                        {selectedCategory ? selectedCategory.name : "Elige una categoría"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Busca una categoría..." />
                        <CommandList>
                            <CommandEmpty>Categoría no encontrada</CommandEmpty>
                            <CommandGroup>
                                {categories.map((category) => (
                                    <CommandItem
                                        key={category.id}
                                        onSelect={() => {
                                            setSelectedCategory(selectedCategory?.id === category.id ? null : category)
                                            updateFiltered()
                                        }}
                                    >
                                        <Check
                                            className={cn("mr-2 h-4 w-4", selectedTopic?.id === category.id ? "opacity-100" : "opacity-0")}
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
                    <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                        {selectedTopic ? selectedTopic.name : "Elige un tema"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Busca un tema..." />
                        <CommandList>
                            <CommandEmpty>Tema no encontrado</CommandEmpty>
                            <CommandGroup>
                                {topics.map((topic) => (
                                    <CommandItem
                                        key={topic.id}
                                        onSelect={() => {
                                            setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)
                                            updateFiltered()
                                        }}
                                    >
                                        <Check
                                            className={cn("mr-2 h-4 w-4", selectedTopic?.id === topic.id ? "opacity-100" : "opacity-0")}
                                        />
                                        {topic.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Popover>
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
                                        {MapStatePaper[state]}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default CustomerFilters

