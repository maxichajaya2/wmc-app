import { RiseUpComponent } from "@/shared/motion"
import {
    Card, CardHeader, CardTitle, CardContent, Skeleton, Avatar, AvatarImage
} from "@/components"
import { useEffect, useState } from 'react'
import { AvatarFallback } from '@radix-ui/react-avatar'

const RECENT_SALES_FAKE_DATA = [
    {
        name: 'Liam Johnson',
        email: 'liam@example.com',
        amount: '$250.00',
    },
    {
        name: 'Olivia Smith',
        email: 'olivia@example.com',
        amount: '$150.00',
    },
    {
        name: 'Noah Williams',
        email: 'noah@example.com',
        amount: '$350.00',
    },
    {
        name: 'Emma Brown',
        email: 'emma@example.com',
        amount: '$450.00',
    },
    {
        name: 'Liam Johnson',
        email: 'jhonson@example.com',
        amount: '$550.00',
    },
]

const fetchData = async (): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ recentSales: RECENT_SALES_FAKE_DATA })
        }, 1600)
    })
}

function RecentSalesCard() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        fetchData().then((response) => {
            setData(response)
            setLoading(false)
        })
    }, [])

    if (loading) return <Skeleton className='w-full h-full' />
    return (
        <RiseUpComponent className='overflow-auto'>
            <Card x-chunk="dashboard-01-chunk-5">
                <CardHeader>
                    <CardTitle>Últimas ventas</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8 overflow-auto">
                    {data?.recentSales.map((sale: any, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                <AvatarFallback>{sale.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none line-clamp-1">
                                    {sale.name}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                    {sale.email}
                                </p>
                            </div>
                            <div className="ml-auto font-medium line-clamp-1">+{sale.amount}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </RiseUpComponent>
    )
}

export default RecentSalesCard