import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components"

function SkeletonCard() {
    return (
        <Card
            x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    <Skeleton className="w-20 h-4" />
                </CardTitle>
                <Skeleton className="w-4 h-4" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    <Skeleton className="w-full h-8" />
                </div>
                <Skeleton className="w-full h-3 mt-2" />
            </CardContent>
        </Card>
    )
}

export default SkeletonCard