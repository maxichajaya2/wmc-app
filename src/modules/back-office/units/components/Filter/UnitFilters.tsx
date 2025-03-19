import {
    Button, Collapsible, CollapsibleContent, CollapsibleTrigger, DropdownMenu,
    DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
    Form,
    FormControl, FormField,
    FormItem, Label, Switch,
    toast
} from "@/components";
import './styles.css';
import { motion } from 'framer-motion';
import { ChevronUp, ListFilter } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useUnitsStore } from "../../store/units.store";

const FormSchema = z.object({
    isActive: z.boolean().default(true).optional(),
    existSunat: z.boolean().default(false).optional(),
})

function UnitFilter() {

    const filterOptions = useUnitsStore((state) => state.filterOptions);
    const clearFiltersUnits = useUnitsStore((state) => state.clearFilters);
    const setFilterOptions = useUnitsStore((state) => state.setFilterOptions);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    const handleClearFilters = () => {
        clearFiltersUnits();
        form.reset();
    }

    useEffect(() => {
        form.setValue('isActive', filterOptions.isActive ?? true);
        form.setValue('existSunat', filterOptions.existSunat ?? false);
    }, [filterOptions.isActive, filterOptions.existSunat])
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    variant={filterOptions.isActive || filterOptions.existSunat ? "default" : "outline"}
                    className="h-8 gap-1 flex justify-between transition-all duration-500"
                >
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ className: filterOptions.isActive || filterOptions.existSunat ? 'w-[34px] md:w-[90px]' : 'w-[34px]' }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden h-8 gap-1 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-1">
                            <ListFilter className={
                                cn("h-3.5 w-3.5",
                                    filterOptions.isActive || filterOptions.existSunat ? "text-white" : ""
                                )
                            } />
                            <span className={
                                cn("sr-only sm:not-sr-only sm:whitespace-nowrap flex justify-between items-center",
                                    filterOptions.isActive || filterOptions.existSunat ? "text-white" : ""
                                )
                            }>
                                Filtros
                            </span>
                        </div>
                        {(filterOptions.isActive || filterOptions.existSunat) && (
                            <span className="text-xs font-semibold bg-white text-primary h-4 w-4 rounded-full">
                                {Object.values(filterOptions).filter(Boolean).length}
                            </span>
                        )}
                    </motion.div>
                </Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-3">
                <DropdownMenuLabel asChild>
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Filtros</span>
                        <Button
                            variant={"link"}
                            className="h-fit p-0 m-0 text-xs"
                            onClick={handleClearFilters}>Limpiar</Button>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Collapsible defaultOpen className="max-w-80 min-w-56 px-2 pt-2">
                    <CollapsibleTrigger className="w-full text-left text-xs font-semibold p-0 m-0 flex justify-between">
                        <span>Estados</span>
                        <ChevronUp className="h-3.5 w-3.5 transition-transform duration-200" data-state-transform />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="CollapsibleContent">
                        <pre className="hidden">
                            {JSON.stringify(filterOptions, null, 2)}
                            {JSON.stringify(Object.values(filterOptions).filter(Boolean).length, null, 2)}
                        </pre>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 py-2">
                                <div>
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="isActive"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-y-0">
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={(e) => {
                                                                form.setValue('isActive', e);
                                                                setFilterOptions({ isActive: e, existSunat: filterOptions.existSunat });
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <Label className="m-0 p-0 pl-2">Activo</Label>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="existSunat"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-y-0">
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={(e) => {
                                                                form.setValue('existSunat', e);
                                                                setFilterOptions({ isActive: filterOptions.isActive, existSunat: e });
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <Label className="m-0 p-0 pl-2">Existe en Sunat</Label>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </CollapsibleContent>
                </Collapsible>
                <div className="px-2 pb-2">
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UnitFilter