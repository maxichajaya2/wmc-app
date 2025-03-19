"use client"

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RadioGroup,
  RadioGroupItem,
  Label,
} from "@/components"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import { useEnrollmentStore } from "../../store/enrollments.store"
import { DialogDescription } from "@radix-ui/react-dialog"
import type { PaymentStatus } from "@/models/"

function PaymentStatusDialog() {
  const selected = useEnrollmentStore((state) => state.selected)
  const loading = useEnrollmentStore((state) => state.loading)
  const isOpenPaymentStatusDialog = useEnrollmentStore((state) => state.isOpenPaymentStatusDialog)
  const closePaymentStatusDialog = useEnrollmentStore((state) => state.closePaymentStatusDialog)
  const changePaymentStatus = useEnrollmentStore((state) => state.changePaymentStatus)

  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | null>(
    selected ? (selected.paymentStatus as PaymentStatus) : null,
  )

  const handleSubmit = () => {
    if (selectedStatus !== null) {
      changePaymentStatus({ status: selectedStatus })
    }
  }

  return (
    <Dialog
      open={isOpenPaymentStatusDialog}
      onOpenChange={(open) => {
        if (!open) {
          closePaymentStatusDialog()
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Cambiar Estado de Pago</DialogTitle>
          <DialogDescription>
            Seleccione el nuevo estado de pago para la inscripción de {selected?.name} {selected?.paternalName}{" "}
            {selected?.maternalName}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            defaultValue={selected?.paymentStatus.toString()}
            onValueChange={(value) => setSelectedStatus(Number.parseInt(value) as PaymentStatus)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="1" id="payment-success" />
              <Label htmlFor="payment-success" className="font-medium">
                Pagado
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="2" id="payment-pending" />
              <Label htmlFor="payment-pending" className="font-medium">
                Pendiente
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="payment-rejected" />
              <Label htmlFor="payment-rejected" className="font-medium">
                Rechazado
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="flex flex-row gap-2">
          <Button
            disabled={loading || selectedStatus === null}
            onClick={handleSubmit}
            className="font-bold py-2 px-4 rounded duration-300 text-white"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <LoaderCircle size={24} className="animate-spin text-white" />
              </div>
            ) : (
              "Guardar"
            )}
          </Button>
          <Button
            disabled={loading}
            onClick={closePaymentStatusDialog}
            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentStatusDialog

