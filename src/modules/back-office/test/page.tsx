import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components";
import { cn } from "@/lib/utils";

interface IPrimaryEvent {
    icon: string;
    color: string;
    position: string;
    z?: number
}

function Test() {
    const listPrimaryEvents: IPrimaryEvent[] = [
        {
            icon: '🥰',
            color: '#ef4444',
            position: 'top-2 left-0',
            z: 100
        },
        {
            icon: '🤩',
            color: '#553c9a',
            position: '-top-5 right-10',
            z: 100
        },
        {
            icon: '🥳',
            color: '#9ca3af',
            position: 'bottom-5 left-0',
            z: 100
        },
        {
            icon: '🤯',
            color: '#b45309',
            position: 'bottom-2 right-5',
            z: 100
        },
    ]

    const listSecondaryEvents: IPrimaryEvent[] = [
        {
            icon: '🤶',
            color: '#8a63d2',
            position: '-top-5 left-10',
        },
        {
            icon: '🥳',
            color: '#3b82f6',
            position: 'top-5 right-0',
        },
        {
            icon: '😎',
            color: '#10b981',
            position: 'bottom-10 -left-4',
        },
        {
            icon: '🔥',
            color: '#f59e0b',
            position: '-bottom-2 right-10',
        },
    ]

    return (
        <div className="w-full h-full bg-blue-300 flex justify-center items-center">
            {/* Outer Circle */}
            <div className={cn(
                "w-[300px] h-[300px] border border-white rounded-full relative z-[100]",
                "flex justify-center items-center",
            )}>
                {listPrimaryEvents.map((event, index) => (
                    <FloatingSphere
                        key={index}
                        {...event}
                    />
                ))}

                {/* Inner Circle */}
                <div className={cn(
                    "w-[200px] h-[200px] border border-white rounded-full relative z-[150]",
                )}>
                    {listSecondaryEvents.map((event, index) => (
                        <FloatingSphere
                            key={index}
                            {...event}
                            size={40}
                            fontSize={22}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Test

function FloatingSphere({
    icon,
    color,
    position,
    size = 60,
    fontSize = 36,
    z
}: IPrimaryEvent & {
    size?: number,
    fontSize?: number,
}) {
    return (

        <div
            className={cn(
                `rounded-full`,
                position,
                "flex justify-center items-center",
                "absolute",
                "animate-float-primary"
            )}
            style={{
                width: size,
                height: size,
                backgroundColor: color,
            }}
        >
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className={cn("hover:scale-150 transition-transform duration-200")}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: size,
                                height: size,
                                backgroundColor: color,
                                borderRadius: "100%",
                            }}
                        >
                            <span style={{ fontSize }}>{icon}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent style={{ backgroundColor: color, zIndex: `${z} !important`, position: 'relative' }} className={`rounded-md text-white !z-[150]`}>
                        <p>Celebra la fiesta de {icon}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}