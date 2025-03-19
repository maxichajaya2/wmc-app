"use client"

import { CardFooter } from "@/components/ui/card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components"
import { useEffect } from "react"
import { DataTable, DataTableSkeleton, FadeInComponent } from "@/shared"
import { columns } from "./components"
import { useEnrollmentStore } from "./store/enrollments.store"
import EnrollmentFilters from "./components/Filter/FilterDialog"
import EnrollmentDialog from "./components/Dialog/EnrollmentDialog"
import { useCheckPermission } from "@/utils"
import { ActionRoles, ModulesRoles } from "@/constants"
import PaymentStatusDialog from "./components/Dialog/PaymentStatusDialog"
import SieRegistrationDialog from "./components/Dialog/SieRegistrationDialog"

function EnrollmentsManagementPage() {
  const loading = useEnrollmentStore((state) => state.loading)
  const isOpenDialog = useEnrollmentStore((state) => state.isOpenDialog)
  const isOpenPaymentStatusDialog = useEnrollmentStore((state) => state.isOpenPaymentStatusDialog)
  const isOpenSieDialog = useEnrollmentStore((state) => state.isOpenSieDialog)
  const filtered = useEnrollmentStore((state) => state.filtered)
  // const filterTerm = useEnrollmentStore((state) => state.filterTerm)

  const findAll = useEnrollmentStore((state) => state.findAll)
  // const setFilterTerm = useEnrollmentStore((state) => state.setFilterTerm)
  // const openActionModal = useEnrollmentStore((state) => state.openActionModal)

  const hasReadPermission = useCheckPermission(ModulesRoles.DASHBOARD, ActionRoles.READ)

  useEffect(() => {
    if (hasReadPermission) {
      findAll()
    }
  }, [hasReadPermission, findAll])

  // const handleCreate = useCallback(() => {
  //   openActionModal(0, "create")
  // }, [openActionModal])

  // const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterTerm(e.target.value)
  // }

  return (
    <main className="grid flex-1 items-start p-2 overflow-auto">
      {/* <div className="flex items-center py-2 gap-2 hidden">
        <div className="ml-1">
          <Input
            type="text"
            value={filterTerm}
            onChange={handleFilterChange}
            placeholder="Búsqueda por nombre o documento..."
            className="h-9 md:min-w-80"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1 hidden" disabled>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exportar</span>
          </Button>
          {useCheckPermission(ModulesRoles.DASHBOARD, ActionRoles.CREATE) && (
            <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
              <PlusCircle className="h-3.5 w.3.5 text-white" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">Añadir Inscripción</span>
            </Button>
          )}
        </div>
      </div> */}
      <EnrollmentFilters />
      <div className="overflow-auto">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Inscripciones</CardTitle>
            <CardDescription>Lista de inscripciones registradas.</CardDescription>
          </CardHeader>
          <CardContent>
            {hasReadPermission &&
              (loading ? (
                <DataTableSkeleton columns={columns} />
              ) : (
                <FadeInComponent className="overflow-auto">
                  <DataTable columns={columns} data={filtered} />
                </FadeInComponent>
              ))}
          </CardContent>
          <CardFooter />
        </Card>
      </div>
      {isOpenDialog && <EnrollmentDialog />}
      {isOpenPaymentStatusDialog && <PaymentStatusDialog />}
      {isOpenSieDialog && <SieRegistrationDialog />}
    </main>
  )
}

export default EnrollmentsManagementPage

