
import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components"
import { DollarSign } from "lucide-react"
import SkeletonCard from "../common/SkeletonCard"
import { RiseUpComponent } from "@/shared/motion"

const fetchData = async (): Promise<
    { totalIncomes: number }
> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ totalIncomes: 45231.89 })
        }, 1000)
    })
}

function TotalIncomes() {
    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState<
        { totalIncomes: number } | null
    >(null)

    React.useEffect(() => {
        fetchData().then((response) => {
            setData(response)
            setLoading(false)
        })
    }, [])

    if (loading) return <SkeletonCard />
    return (
        <RiseUpComponent>
            <Card
                x-chunk="dashboard-01-chunk-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium line-clamp-1">
                        Ingresos Totales
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold line-clamp-1">S/. {data?.totalIncomes}</div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                        +20.1% desde el mes pasado
                    </p>
                </CardContent>
            </Card>
        </RiseUpComponent>
    )
}

export default TotalIncomes