
// import { ActiveSales, Clients, RecentSales, Sales, TotalIncomes, Transactions } from "./components"

function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 w-full">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <h4>Bienvenido</h4>
        {/* <TotalIncomes /> */}
        {/* <Sales /> */}
        {/* <ActiveSales /> */}
        {/* <Clients /> */}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {/* <Transactions /> */}
        {/* <RecentSales /> */}
      </div>
    </main>
  )
}

export default DashboardPage