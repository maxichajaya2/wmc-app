
import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components"
import { CreditCard } from "lucide-react"
import SkeletonCard from "../common/SkeletonCard"
import { RiseUpComponent } from "@/shared/motion"

const fetchData = async (): Promise<
    { sales: number }
> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ sales: 1235 })
        }, 1200)
    })
}

function SalesCard() {
    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState<
        { sales: number } | null
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
            <Card x-chunk="dashboard-01-chunk-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium line-clamp-1">Ventas</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold line-clamp-1">+{data?.sales}</div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                        +19% desde el mes pasado
                    </p>
                </CardContent>
            </Card>
        </RiseUpComponent>
    )
}

export default SalesCard