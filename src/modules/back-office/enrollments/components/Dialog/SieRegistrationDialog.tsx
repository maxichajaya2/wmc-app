import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Alert,
    AlertTitle,
    AlertDescription,
} from "@/components"
import { LoaderCircle, AlertCircle, CheckCircle2 } from "lucide-react"
import { useEnrollmentStore } from "../../store/enrollments.store"
import { DialogDescription } from "@radix-ui/react-dialog"

function SieRegistrationDialog() {
    const selected = useEnrollmentStore((state) => state.selected)
    const loading = useEnrollmentStore((state) => state.loading)
    const isOpenSieDialog = useEnrollmentStore((state) => state.isOpenSieDialog)
    const closeSieDialog = useEnrollmentStore((state) => state.closeSieDialog)
    const sendToSie = useEnrollmentStore((state) => state.sendToSie)
    const sieResponse = useEnrollmentStore((state) => state.sieResponse)

    const handleSubmit = () => {
        sendToSie()
    }

    return (
        <Dialog
            open={isOpenSieDialog}
            onOpenChange={(open) => {
                if (!open) {
                    closeSieDialog()
                }
            }}
        >
            <DialogContent
                onPointerDownOutside={(e) => {
                    e.preventDefault()
                }}
            >
                <DialogHeader>
                    <DialogTitle>Enviar a SIE</DialogTitle>
                    <DialogDescription>
                        Enviar la inscripción de {selected?.name} {selected?.paternalName} {selected?.maternalName} al Sistema de
                        Información Estudiantil (SIE)
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {sieResponse ? (
                        <Alert variant={sieResponse.success ? "default" : "destructive"}>
                            {sieResponse.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle>{sieResponse.success ? "Enviado correctamente" : "Error al enviar"}</AlertTitle>
                            <AlertDescription>
                                {sieResponse.success ? (
                                    <>
                                        La inscripción ha sido enviada correctamente al SIE.
                                        <br />
                                        Código de registro: <strong>{sieResponse.code}</strong>
                                    </>
                                ) : (
                                    sieResponse.message
                                )}
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <p className="text-center">
                            ¿Está seguro que desea enviar esta inscripción al SIE?
                            <br />
                            Esta acción no se puede deshacer.
                        </p>
                    )}
                </div>

                <DialogFooter className="flex flex-row gap-2">
                    {!sieResponse ? (
                        <>
                            <Button
                                disabled={loading}
                                onClick={handleSubmit}
                                className="font-bold py-2 px-4 rounded duration-300 text-white"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <LoaderCircle size={24} className="animate-spin text-white" />
                                    </div>
                                ) : (
                                    "Enviar a SIE"
                                )}
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={closeSieDialog}
                                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300"
                            >
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={closeSieDialog}
                            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300"
                        >
                            Cerrar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SieRegistrationDialog

