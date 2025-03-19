
import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components"
import { Users } from "lucide-react"
import { RiseUpComponent } from "@/shared/motion"
import SkeletonCard from "../common/SkeletonCard"

const fetchData = async (): Promise<
    { totalClients: number }
> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ totalClients: 23 })
        }, 1400)
    })
}

function ClientsCard() {
    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState<
        { totalClients: number } | null
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
            <Card x-chunk="dashboard-01-chunk-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium line-clamp-1">
                        Clientes
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold line-clamp-1">+{data?.totalClients}</div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                        +180.1% desde el mes pasado
                    </p>
                </CardContent>
            </Card>
        </RiseUpComponent>
    )
}

export default ClientsCard