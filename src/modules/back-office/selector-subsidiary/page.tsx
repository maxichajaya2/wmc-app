import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Check, LoaderCircle, Store } from 'lucide-react'
import { useSubsidiaryStore } from '../subsidiary/store/subsidiary.store'
import { useSessionBoundStore } from '../auth/store'
import { Subsidiary } from '@/models'

export default function SelectorSubsidiaryPage() {
    const [selectedOption, setSelectedOption] = useState<Subsidiary | null>(null)

    const loading = useSubsidiaryStore(state => state.loading)
    const subsidiaries = useSubsidiaryStore(state => state.data)
    const findAll = useSubsidiaryStore(state => state.findAll)
    const currentSubsidiary = useSessionBoundStore(state => state.currentSubsidiary)
    const updateCurrentSubsidiary = useSessionBoundStore(state => state.updateCurrentSubsidiary)

    useEffect(() => {
        findAll()
    }, [])

    useEffect(() => {
        if (currentSubsidiary) {
            setSelectedOption(currentSubsidiary)
        }
    }, [currentSubsidiary])

    const handleUpdateCurrentSubsidiary = () => {
        if (selectedOption) {
            updateCurrentSubsidiary(selectedOption)
        }
    }


    return (
        <div className="min-h-full flex flex-col items-center justify-center p-4">
            <div className="rounded-lg p-6 w-full max-w-4xl">
                <h1 className="text-2xl font-bold text-center mb-8">Seleccione la sucursal</h1>
                <pre className='hidden'>
                    {JSON.stringify({ currentSubsidiary }, null, 2)}
                </pre>
                {loading && (
                    <div className="flex items-center justify-center space-x-2">
                        <LoaderCircle size={24} className="animate-spin text-primary" />
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subsidiaries.map((option) => (
                        <div
                            key={option.id}
                            className={'flex flex-col items-center cursor-pointer'}
                            onClick={() => setSelectedOption(option)}
                        >
                            <div className="w-32 h-32 flex items-center justify-center mb-4 overflow-hidden relative">
                                {option.image ? (
                                    <img src={option.image} alt={option.name}
                                        className="w-full h-full aspect-square object-cover rounded-full border-2 border-gray-300" />
                                ) : (
                                    <div className="w-full h-full object-cover rounded-full border-2 border-primary flex items-center justify-center bg-primary">
                                        <Store className="w-16 h-16 text-white" strokeWidth={2} />
                                    </div>
                                )}
                                {selectedOption?.id === option.id && (
                                    <div className='absolute top-1 right-0 bg-green-400  rounded-full p-2 z-50 flex items-center justify-center'>
                                        <Check className="w-6 h-6 text-white" strokeWidth={3.5} />
                                    </div>
                                )}
                            </div>
                            <h2 className="font-semibold text-center">{option.name}</h2>
                            <p className="text-sm text-center">{option.address}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <Button
                        disabled={!selectedOption || loading || selectedOption?.id === currentSubsidiary?.id}
                        onClick={handleUpdateCurrentSubsidiary}
                        className='text-white'
                    >
                        CONTINUAR
                    </Button>
                </div>
            </div>
        </div>
    )
}