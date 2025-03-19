import './styles.css'

import type React from "react"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
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
} from "@/components"
import { MapPaymentStatus, MapRegistrationStatus, PaymentStatus, RegistrationStatus } from "@/models"
import { useEnrollmentStore } from "../../store/enrollments.store"

function EnrollmentFilters() {
    const {
        filterTerm,
        dateRange,
        selectedPaymentStatus,
        selectedRegistrationStatus,
        setFilterTerm,
        setDateRange,
        setSelectedPaymentStatus,
        setSelectedRegistrationStatus,
        updateFiltered,
    } = useEnrollmentStore()

    const paymentStatuses = [
        { id: PaymentStatus.SUCCESS, name: MapPaymentStatus[PaymentStatus.SUCCESS] },
        { id: PaymentStatus.PENDING, name: MapPaymentStatus[PaymentStatus.PENDING] },
        { id: PaymentStatus.REJECTED, name: MapPaymentStatus[PaymentStatus.REJECTED] },
    ]

    const registrationStatuses = [
        { id: RegistrationStatus.REGISTERED, name: MapRegistrationStatus[RegistrationStatus.REGISTERED] },
        { id: RegistrationStatus.SIE, name: MapRegistrationStatus[RegistrationStatus.SIE] },
        { id: RegistrationStatus.ANULADO, name: MapRegistrationStatus[RegistrationStatus.ANULADO] },
    ]

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
                            if (range?.from) handleDateChange(range.from, "start");
                            if (range?.to) handleDateChange(range.to, "end");
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                        {selectedPaymentStatus !== null
                            ? MapPaymentStatus[selectedPaymentStatus as PaymentStatus]
                            : "Estado de pago"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar estado..." />
                        <CommandList>
                            <CommandEmpty>Estado no encontrado</CommandEmpty>
                            <CommandGroup>
                                {paymentStatuses.map((status) => (
                                    <CommandItem
                                        key={status.id}
                                        onSelect={() => {
                                            setSelectedPaymentStatus(selectedPaymentStatus === status.id ? null : status.id);
                                            updateFiltered();
                                        }}
                                    >
                                        <Check
                                            className={cn("mr-2 h-4 w-4", selectedPaymentStatus === status.id ? "opacity-100" : "opacity-0")}
                                        />
                                        {status.name}
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
                        {selectedRegistrationStatus !== null
                            ? MapRegistrationStatus[selectedRegistrationStatus as RegistrationStatus]
                            : "Estado de registro"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar estado..." />
                        <CommandList>
                            <CommandEmpty>Estado no encontrado</CommandEmpty>
                            <CommandGroup>
                                {registrationStatuses.map((status) => (
                                    <CommandItem
                                        key={status.id}
                                        onSelect={() => {
                                            setSelectedRegistrationStatus(selectedRegistrationStatus === status.id ? null : status.id);
                                            updateFiltered();
                                        }}>
                                        <Check
                                            className={cn("mr-2 h-4 w-4", selectedRegistrationStatus === status.id ? "opacity-100" : "opacity-0")}
                                        />
                                        {status.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Button
                variant="outline"
                onClick={() => {
                    setFilterTerm("");
                    setDateRange({ start: "", end: "" });
                    setSelectedPaymentStatus(null);
                    setSelectedRegistrationStatus(null);
                    updateFiltered();
                }}
            >
                Limpiar filtros
            </Button>
        </div>
    )
}

export default EnrollmentFilters

