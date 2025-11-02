import { RiseUpComponent } from "@/shared/motion"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Card, CardHeader, CardTitle, CardContent, CardDescription,
    Button,
    Badge,
    Skeleton
} from "@/components"
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'

const CLIENTS_FAKE_DATA = [
    {
        name: 'Liam Johnson',
        email: 'liam@example.com',
        type: 'Sale',
        status: 'Approved',
        date: '2023-06-23',
        amount: '$250.00',
    },
    {
        name: 'Olivia Smith',
        email: 'olivia@example.com',
        type: 'Refund',
        status: 'Declined',
        date: '2023-06-24',
        amount: '$150.00',
    },
    {
        name: 'Noah Williams',
        email: 'noah@example.com',
        type: 'Subscription',
        status: 'Approved',
        date: '2023-06-25',
        amount: '$350.00',
    },
    {
        name: 'Emma Brown',
        email: 'emma@example.com',
        type: 'Sale',
        status: 'Approved',
        date: '2023-06-26',
        amount: '$450.00',
    },
    {
        name: 'Liam Johnson',
        email: 'jhonson@example.com',
        type: 'Sale',
        status: 'Approved',
        date: '2023-06-27',
        amount: '$550.00',
    },
]

const fetchData = async (): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ transactions: CLIENTS_FAKE_DATA })
        }, 1500)
    })
}

function TransactionsCard() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        fetchData().then((response) => {
            setData(response)
            setLoading(false)
        })
    }, [])

    if (loading) return <Skeleton className='w-full h-[600px]' />
    return (
        <RiseUpComponent className='overflow-auto'>
            <Card
                className="xl:col-span-4 w-full overflow-auto" x-chunk="dashboard-01-chunk-4"
            >
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle className='line-clamp-1'>Transacciones</CardTitle>
                        <CardDescription className='line-clamp-1'>
                            Transacciones recientes de su tienda.
                        </CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1 text-white">
                        <Link to="#">
                            Ver todas
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.transactions.map((client: any) => (
                                <TableRow key={client.email}>
                                    <TableCell>
                                        <div className="font-medium">{client.name}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline line-clamp-1">
                                            {client.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>{client.type}</TableCell>
                                    <TableCell className="">
                                        <Badge className="text-xs line-clamp-1" variant="outline">
                                            {client.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="">
                                        {client.date}
                                    </TableCell>
                                    <TableCell className="text-right">{client.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </RiseUpComponent>
    )
}

export default TransactionsCard