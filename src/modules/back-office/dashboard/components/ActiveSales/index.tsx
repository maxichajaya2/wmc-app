
import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components"
import { Activity } from "lucide-react"
import { RiseUpComponent } from "@/shared/motion"
import SkeletonCard from "../common/SkeletonCard"

const fetchData = async (): Promise<
    { activeSales: number }
> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ activeSales: 3145 })
        }, 1300)
    })
}

function ActiveSalesCard() {
    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState<
        { activeSales: number } | null
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
            <Card x-chunk="dashboard-01-chunk-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium line-clamp-1">Activas ahora</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold line-clamp-1">+{data?.activeSales}</div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                        +201 desde la última hora
                    </p>
                </CardContent>
            </Card>
        </RiseUpComponent>
    )
}

export default ActiveSalesCard