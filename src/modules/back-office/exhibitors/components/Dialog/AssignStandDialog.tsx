"use client"

import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle, Form
} from "@/components"
import { LoaderCircle } from "lucide-react"
import { useEffect } from "react"
import { useExhibitorStore } from "../../store/exhibitor.store"
import { DialogDescription } from "@radix-ui/react-dialog"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import StandSelect from "./StandSelect"

function StandAssignmentDialog() {
    const action = useExhibitorStore(state => state.action);
    const selected = useExhibitorStore((state) => state.selected)
    const loading = useExhibitorStore((state) => state.loading)
    const isOpenAssignStandDialog = useExhibitorStore((state) => state.isOpenAssignStandDialog)
    const closeAssignStandModal = useExhibitorStore((state) => state.closeAssignStandModal)
    const assignStands = useExhibitorStore((state) => state.assignStands)

    const FormSchema = z.object({
        standIds: z.array(z.number()).optional(),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            standIds: [],
        },
    })

    useEffect(() => {
        if (selected) {
            form.reset({
                standIds: selected.stands?.map((stand) => stand.id) || [],
            })
        }
    }, [selected])

    // Reset form when dialog is closed
    useEffect(() => {
        return () => {
            form.reset()
        }
    }, [])

    const title = () => {
        switch (action) {
            case 'assign-stand':
                return 'Asignar Stands'
            default:
                return 'Stands'
        }
    };

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!data.standIds) return
        if (action === 'assign-stand') {
            return assignStands(data.standIds)
        }
    }

    return (
        <Dialog open={isOpenAssignStandDialog} onOpenChange={(open) => {
            if (!open) {
                closeAssignStandModal()
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

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-1 gap-0 md:gap-8 space-y-6">
                        <pre className="text-xs col-span-2 hidden">
                            <code>
                                {JSON.stringify({
                                    form: form.watch(), action,
                                    errors: form.formState.errors

                                }, null, 4)}
                            </code>
                        </pre>
                        {(action === 'assign-stand') && (
                            <div className='space-y-6'>
                                <StandSelect form={form} loading={loading} />
                            </div>
                        )}
                        <DialogFooter className='col-span-1 md:col-span-2 ml-auto flex flex-row gap-2'>
                            <Button
                                disabled={loading}
                                type="submit"
                                className="font-bold py-2 px-4 rounded duration-300 text-white">
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <LoaderCircle size={24} className="animate-spin text-white" />
                                    </div>
                                ) : "Guardar"}
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={closeAssignStandModal}
                                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300">
                                Cancelar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

export default StandAssignmentDialog

