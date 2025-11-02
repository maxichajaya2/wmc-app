import * as React from "react"
import Select, { type DropdownIndicatorProps, components, Props as SelectProps } from 'react-select';
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react";

export interface SelectSearchProps extends SelectProps {
    classNameContainer?: string
}

const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <ChevronDown className='h-5 w-5' />
        </components.DropdownIndicator>
    )
}

const SelectSearch = React.forwardRef<HTMLDivElement, SelectSearchProps>(
    ({ classNameContainer, className, ...props }, ref) => {
        return (
            <div ref={ref}
                className={cn('w-full', classNameContainer)}
            >
                <Select
                    components={{ DropdownIndicator }}
                    classNamePrefix="react-select"
                    classNames={{
                        control: (_state) =>
                            cn('flex h-10 w-full text-sm px-2'),
                        placeholder: (props) =>
                            cn('text-muted-foreground', props.className),
                        indicatorSeparator: (props) =>
                            cn('hidden', props.className),
                        valueContainer: (_props) => ''
                            // cn('flex flex-row items-center', props.className),
                    }}
                    {...props}
                />
            </div>
        )
    }
)
SelectSearch.displayName = "SelectSearch"

export { SelectSearch }