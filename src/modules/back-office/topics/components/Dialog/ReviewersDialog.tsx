import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Dialog, DialogContent, DialogHeader, DialogTitle, Popover, PopoverContent, PopoverTrigger } from '@/components';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTopicStore } from '../../store/topic.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { DataTable, DataTableSkeleton, FadeInComponent } from '@/shared';
import { columns } from '../Table/columns-reviewers';
import { cn } from '@/lib/utils';
import { useUserWebStore } from '@/modules/back-office/users-web/store/users-web.store';
import { UserWeb } from '@/models';


function ReviewersDialog() {

    const selected = useTopicStore(state => state.selected);
    const action = useTopicStore(state => state.action);
    const loading = useTopicStore(state => state.loading);
    const isOpenDialog = useTopicStore(state => state.isOpenDialogUsers);
    const closeActionModalUsers = useTopicStore(state => state.closeActionModalUsers);
    const usersWebFromTopic = useTopicStore(state => state.usersWebFromTopic);
    const findUsers = useTopicStore(state => state.findUsers);
    const assignUser = useTopicStore(state => state.assignUser);

    const filteredUserWeb = useUserWebStore(state => state.filtered);
    const reviewers = filteredUserWeb.filter((user) => user)
    const [selectedReviewer, setSelectedReviewer] = useState<UserWeb | null>(null)

    const title = () => {
        switch (action) {
            case 'view-reviewers':
                return 'Lista de Revisores'
            case 'delete':
                return 'Eliminar Tema'
            case 'create':
                return 'Crear Tema'
            default:
                return 'Tema'
        }
    };

    // Reset form when dialog is closed
    useEffect(() => {
        findUsers()
        return () => {
            setSelectedReviewer(null)
        }
    }, [])

    async function handleAssignUser() {
        if (selectedReviewer) {
            try {
                await assignUser(selectedReviewer.id)
                setSelectedReviewer(null)
            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <Dialog open={isOpenDialog} onOpenChange={(open) => {
            if (!open) {
                closeActionModalUsers()
            }
        }}>
            <DialogContent
                onPointerDownOutside={e => {
                    e.preventDefault()
                }}>
                <DialogHeader>
                    <DialogTitle>{title()}</DialogTitle>
                </DialogHeader>

                <DialogDescription />

                <div className='flex flex-row gap-3 p-3 rounded-md border border-slate-400 shadow-md mb-3'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                                {selectedReviewer ? `${selectedReviewer.name} ${selectedReviewer.lastName}` : "Asigna un revisor"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Buscar revisor..." />
                                <CommandList>
                                    <CommandEmpty>Revisor no encontrado.</CommandEmpty>
                                    <CommandGroup>
                                        {reviewers.map((reviewer) => (
                                            <CommandItem
                                                key={reviewer.id}
                                                onSelect={() => {
                                                    setSelectedReviewer(selectedReviewer?.id === reviewer.id ? null : reviewer)
                                                }}
                                            >
                                                <Check
                                                    className={cn("mr-2 h-4 w-4", selectedReviewer?.id === reviewer.id ? "opacity-100" : "opacity-0")}
                                                />
                                                {`${reviewer.name} ${reviewer.lastName}`}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Button
                        disabled={loading || !selectedReviewer}
                        type="button"
                        onClick={handleAssignUser}
                        className="font-bold py-2 px-4 rounded duration-300 text-white">
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <LoaderCircle size={24} className="animate-spin text-white" />
                            </div>
                        ) : "Asignar"}
                    </Button>
                </div>

                <div className="overflow-auto">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Revisores de {selected?.name}</CardTitle>
                            <CardDescription>
                                Lista de revisores asignados al tema.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? <DataTableSkeleton columns={columns} /> : (
                                <FadeInComponent className="overflow-auto">
                                    <DataTable columns={columns} data={usersWebFromTopic} />
                                </FadeInComponent>
                            )}
                        </CardContent>
                        <CardFooter />
                    </Card>

                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ReviewersDialog