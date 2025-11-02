import { useEffect } from "react"
import { motion } from 'framer-motion'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChevronUp, ListFilter } from "lucide-react"
import './styles.css'
import {
    Button, Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Form,
    FormControl, FormField,
    FormItem,
    FormLabel,
    FormMessage,
    toast
} from "@/components"
import { cn } from "@/lib/utils"
import { RoleName } from "@/models"
import { useUsersStore } from '../../store/users.store'
import { useRoleStore } from "@/modules/back-office/roles/store/roles.store"

const FormSchema = z.object({
    items: z.array(z.nativeEnum(RoleName)).optional(),
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

function UserFilters() {
    // const dispatch = useDispatch<Dispatch<Action>>();
    // const { selectedRoles } = useSelector(
    //     (state: { userReducer: UsersReducerState }) => state.userReducer,
    // );
    const roles = useRoleStore(state => state.data)
    const selectedRoles = useUsersStore(state => state.selectedRoles)
    const clearFilters = useUsersStore(state => state.clearFilters)
    // const setSelectedRoles = useUsersStore(state => state.setSelectedRoles)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: selectedRoles as any,
        },
    })

    useEffect(() => {
        form.setValue('items', selectedRoles as any);
    }, [selectedRoles])

    const handleClearFilters = () => {
        clearFilters();
        form.reset();
    }
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    variant={selectedRoles.length > 0 ? "default" : "outline"}
                    className="h-8 gap-1 flex justify-between transition-all duration-500"
                >
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ className: selectedRoles.length > 0 ? 'w-[34px] md:w-[90px]' : 'w-[34px]' }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden h-8 gap-1 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-1">
                            <ListFilter className={
                                cn("h-3.5 w-3.5",
                                    selectedRoles.length > 0 ? "text-white" : ""
                                )
                            } />
                            <span className={
                                cn("sr-only sm:not-sr-only sm:whitespace-nowrap flex justify-between items-center",
                                    selectedRoles.length > 0 ? "text-white" : ""
                                )
                            }>
                                Filtros
                            </span>
                        </div>
                        {selectedRoles.length > 0 && (
                            <span className="text-xs font-semibold bg-white text-primary h-4 w-4 rounded-full">
                                {selectedRoles.length}
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
                        <span>Roles</span>
                        <ChevronUp className="h-3.5 w-3.5 transition-transform duration-200" data-state-transform />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="CollapsibleContent">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="items"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                            </div>
                                            {roles.map((key, idx) => {
                                                const item = {
                                                    value: key.id,
                                                    label: key.name,
                                                };
                                                return (
                                                    <FormField
                                                        key={idx + 'fields'}
                                                        control={form.control}
                                                        name="items"
                                                        render={({ field }) => {
                                                            console.log({field})
                                                            // const roles = field.value || [];
                                                            return (
                                                                <FormItem
                                                                    key={idx + 'items'}
                                                                    className="flex flex-row items-start space-x-2 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        {/* <Checkbox
                                                                            checked={(roles as string[]).includes(item.value)}
                                                                            onCheckedChange={(checked) => {
                                                                                if (checked) {
                                                                                    field.onChange([...roles, item.value]);
                                                                                    setSelectedRoles([...roles, item.value]);
                                                                                } else {
                                                                                    field.onChange(
                                                                                        roles.filter((value) => value !== item.value)
                                                                                    );
                                                                                    setSelectedRoles(
                                                                                        roles.filter((value) => value !== item.value)
                                                                                    );
                                                                                }
                                                                            }}
                                                                            className="rounded"
                                                                        /> */}
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        {item.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                );
                                            })}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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

export default UserFilters