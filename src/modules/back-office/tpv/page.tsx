'use client'

import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight, PlusCircle, Banknote, HandCoins } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { ActionRoles, ModulesRoles, ROUTES_PATHS } from '@/constants'
import { Textarea, toast } from '@/components'
import { useCashBoxesStore } from '../cash-box/store/cash-boxes.store'
import { CashBox, CashBoxStatus, Customer, Product, PaymentMethod } from '@/models'
import { useCustomersStore } from '../customers/store/customers.store'
import { useProductsStore } from '../products/store/products.store'
import { Link } from 'react-router-dom'
import { useSalesStore } from '../sales/store/sale.store'
import { MapPaymentMethod } from '../../../models/sale'
import CustomerDialog from '../customers/components/Dialog/CustomerDialog'
import { useCheckPermission } from '@/utils'

type CartItem = Product & { quantity: number }


type PayloadPaymentMethod = {
    method: string
    amount: number
}
export default function TPV() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>()
    const [paymentMethods, setPaymentMethods] = useState<PayloadPaymentMethod[]>([])
    const [documentType, setDocumentType] = useState<string>('Nota de Venta')
    const [note, setNote] = useState<string>('')
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const sliderRef = useRef<HTMLDivElement>(null)

    const [cashBoxSelected, setCashBoxSelected] = useState<CashBox | null>(null)

    // Cajas
    const cashBoxes = useCashBoxesStore(state => state.data)
    const findCashBoxes = useCashBoxesStore(state => state.findAll)

    // Clientes
    const customers = useCustomersStore(state => state.data)
    const findCustomers = useCustomersStore(state => state.findAll)
    const openActionModal = useCustomersStore(state => state.openActionModal);
    const isOpenDialogCustomer = useCustomersStore(state => state.isOpenDialog);

    // Productos
    const products = useProductsStore(state => state.data)
    const findProducts = useProductsStore(state => state.findAll)
    const categories: string[] = useMemo(() => {
        const categories = products.map(product => product.category.name)
        return Array.from(new Set(categories))
    }, [products]);

    // Create sale
    const createSale = useSalesStore(state => state.create);

    // useEffect
    useEffect(() => {
        findCashBoxes()
        findCustomers()
        findProducts()
    }, [])

    const handleSelectCashBox = (cashBoxId: string) => {
        const cashBox = cashBoxes.find(cashBox => cashBox.id === cashBoxId)
        if (cashBox) {
            setCashBoxSelected(cashBox)
        }
    }

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id)
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prevCart, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (productId: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId)
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
            }
            return prevCart.filter(item => item.id !== productId)
        })
    }

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0), [cart])
    // TODO: Calcular el IGV
    const igv = 0 //total * 0.18
    const totalWithIgv = useMemo(() => total + igv, [total, igv])

    const addPaymentMethod = (method: string, amount: number) => {
        setPaymentMethods(prev => {
            const existingMethod = prev.find(payment => payment.method === method)
            if (existingMethod) {
                return prev.map(payment =>
                    payment.method === method ? { ...payment, amount: amount } : payment
                )
            }
            return [...prev, { method, amount }]
        })
    }

    const remainingAmount = useMemo(() => totalWithIgv - paymentMethods.reduce((sum, payment) => sum + payment.amount, 0), [totalWithIgv, paymentMethods])

    const refund = useMemo(() => paymentMethods.reduce((sum, payment) => sum + payment.amount, 0) - totalWithIgv, [paymentMethods, totalWithIgv])

    const scroll = (scrollOffset: number) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
        }
    };

    const handleCreateSale = async () => {
        if (cashBoxSelected && cashBoxSelected.status === CashBoxStatus.CLOSED) {
            alert('La caja seleccionada está cerrada, por favor aperturar la caja')
            return
        }
        if (!selectedCustomer) {
            alert('Por favor, seleccione un cliente')
            return
        }
        if (totalWithIgv <= 0) {
            alert('Por favor, agregue productos al carrito')
            return
        }
        if (remainingAmount > 0) {
            alert('Por favor, complete el pago total antes de confirmar')
            return
        }
        await createSale({
            total: totalWithIgv,
            customerId: selectedCustomer.id,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                salePrice: item.salePrice
            })),
            paymentItems: paymentMethods.map(payment => ({
                paymentMethod: payment.method,
                amount: payment.amount
            })),
        })
        setCart([])
        setPaymentMethods([])
        setNote('')
        setSelectedCustomer(null)
        setIsSheetOpen(false)
    }

    const handleCustomerCreate = useCallback(() => {
        openActionModal("", "create");
    }, []);

    const renderIcon = (method: string) => {
        switch (method) {
            case PaymentMethod.Cash:
                return <Banknote className="mr-2 h-5 w-5 text-white bg-green-500 rounded-full p-1" />
            case PaymentMethod.Yape:
                return <img src="/img/payment-methods/yape.png" alt="Yape" className="mr-2 h-5 w-5" />
            case PaymentMethod.Plin:
                return <img src="/img/payment-methods/plin.png" alt="Yape" className="mr-2 h-5 w-5" />
            case PaymentMethod.Others:
                return <HandCoins className="mr-2 h-5 w-5 text-white bg-blue-500 rounded-full p-1" />
            default:
                return <ShoppingCart className="mr-2 h-5 w-5" />
        }
    }

    return (
        <div className="container mx-auto p-4 relative h-full ">
            {/* bg-[url('/img/pattern-tpv.jpg')] */}
            {/* Selector de cliente */}
            <Card className="mb-4">
                <CardContent className="p-2">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-base font-normal">Caja Seleccionada:
                            <span className="text-primary font-semibold ml-2">{cashBoxSelected?.name || 'No seleccionada'}</span>
                            {/* si el estado es cerrado que vaya a aperturar la caja a ROUTE_PATHS.CASH_BOXES */}
                            {cashBoxSelected && cashBoxSelected.status === CashBoxStatus.CLOSED && (
                                <>
                                    <p className='text-xs'>La caja está cerrada, por favor <Link to={ROUTES_PATHS.ADMIN} className="text-primary underline">Aperturar caja</Link></p>
                                </>
                            )}
                        </h2>
                        <div className="flex items-center space-x-2 mt-2">
                            <Select onValueChange={handleSelectCashBox}>
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue placeholder="Seleccionar caja" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cashBoxes.map(csBox => (
                                        <SelectItem key={csBox.id} value={csBox.id.toString()}>{csBox.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className={cn(
                "mb-4",
                (!cashBoxSelected || (cashBoxSelected?.status === CashBoxStatus.CLOSED)) && "filter blur-sm cursor-not-allowed pointer-events-none"
            )}>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-2xl font-bold">Cliente</h2>
                        <div className="flex items-center space-x-2 mt-2">
                            <Select onValueChange={(value) => setSelectedCustomer(customers.find(c => c.id === value) || null)}>
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map(customer => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.person.legalName ? `${customer.person.legalName}` : `${customer.person.givenNames} ${customer.person.lastName}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button size="sm" className="h-8 gap-1" onClick={handleCustomerCreate}>
                                <PlusCircle className="h-3.5 w-3.5 text-white" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-white">
                                    Añadir Cliente
                                </span>
                            </Button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p><strong>Nombres: </strong>
                            {selectedCustomer && selectedCustomer.person.legalName ? `${selectedCustomer?.person.legalName}` : `${selectedCustomer?.person.givenNames} ${selectedCustomer?.person.lastName}` || 'CLIENTE VARIOS'}
                        </p>
                        <p><strong>Documento: </strong>
                            {selectedCustomer && selectedCustomer?.person.documentNumber || '00000000'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className={cn(
                "grid grid-cols-1 md:grid-cols-5 gap-4 mb-4",
                (!cashBoxSelected || (cashBoxSelected?.status === CashBoxStatus.CLOSED)) && "filter blur-sm cursor-not-allowed pointer-events-none"
            )}>
                {/* Columna izquierda: Selector de productos */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <CardContent className="p-4">
                            <h2 className="text-2xl font-bold mb-4">Productos</h2>
                            <Input className="mb-4" placeholder="Buscar producto..." />
                            <div className="flex flex-wrap gap-2 mb-4">
                                {categories.map(category => (
                                    <Badge
                                        key={category}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        className={cn(
                                            "cursor-pointer",
                                            selectedCategory === category && "bg-primary text-white"
                                        )}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                            <div className="relative">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                                    onClick={() => scroll(-200)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div ref={sliderRef} className="flex overflow-x-auto space-x-4 py-4 px-8 scrollbar-hide">
                                    {products
                                        .filter(product => !selectedCategory || product.category.name === selectedCategory)
                                        .map(product => (
                                            <Card key={product.id} className="flex-shrink-0 w-48">
                                                <CardContent className="p-4">
                                                    <h3 className="font-bold">{product.name}</h3>
                                                    <p>S/ {product.salePrice.toFixed(2)}</p>
                                                    <Badge variant="secondary" className="mt-1">{product.category.name}</Badge>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <Button size="icon" variant="default" className='text-white dark:text-white' onClick={() => removeFromCart(product.id)}>
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className='font-bold text-xl'>{cart.find(item => item.id === product.id)?.quantity || 0}</span>
                                                        <Button size="icon" variant="default" className='text-white dark:text-white' onClick={() => addToCart(product)}>
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <p className="mt-2 font-semibold">
                                                        Subtotal: S/ {((cart.find(item => item.id === product.id)?.quantity || 0) * product.salePrice).toFixed(2)}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                                    onClick={() => scroll(200)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Columna central: Carrito */}
                <div className="md:col-span-3">
                    <Card className="h-full">
                        <CardContent className="p-4">
                            <h2 className="text-2xl font-bold mb-4">Carrito</h2>
                            <div className="space-y-2 md:max-h-[300px] overflow-y-auto">
                                {cart.map(item => (
                                    <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className='w-full'>
                                            <p className="font-bold">{item.name}</p>
                                            <Badge variant="outline">S/ {item.salePrice}</Badge>
                                            <Badge variant="secondary" className='ml-1'>{item.category.name}</Badge>
                                        </div>
                                        <div className="flex w-full md:w-fit items-center justify-between gap-2 mt-2">
                                            <div className='flex items-center gap-2'>
                                                <Button size="icon" variant="default" className='text-white dark:text-white' onClick={() => removeFromCart(item.id)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className='h-4 w-4 flex items-center justify-center font-semibold text-lg'>{item.quantity}</span>
                                                <Button size="icon" variant="default" className='text-white dark:text-white' onClick={() => addToCart(item)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="font-semibold text-lg w-fit md:w-32">S/ {(item.quantity * item.salePrice).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Resumen de venta (fijo en la parte inferior) */}
            <Card
                className={cn(
                    "backdrop-blur-sm shadow-xl shadow-primary/20 border border-gray-200 bg-primary",
                    (!cashBoxSelected || (cashBoxSelected?.status === CashBoxStatus.CLOSED)) && "filter blur-sm cursor-not-allowed pointer-events-none"
                )}>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className='text-white dark:text-white'>
                            <h2 className="text-2xl font-bold">Resumen</h2>
                            <p>Subtotal: S/ {total.toFixed(2)}</p>
                            <p className='text-gray-300'>IGV (18%): S/ {igv.toFixed(2)}</p>
                            <p className="text-2xl font-bold">Total: S/ {totalWithIgv.toFixed(2)}</p>
                        </div>
                        <div className="flex space-x-2">
                        </div>
                        <div className='flex flex-col gap-2 items-center'>
                            <Select onValueChange={setDocumentType} defaultValue={documentType}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tipo de documento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nota de Venta">Nota de Venta</SelectItem>
                                    <SelectItem value="Boleta" disabled>Boleta</SelectItem>
                                    <SelectItem value="Factura" disabled>Factura</SelectItem>
                                </SelectContent>
                            </Select>
                            <Sheet open={isSheetOpen} onOpenChange={
                                (isOpen) => {
                                    if (!isOpen) {
                                        setPaymentMethods([])
                                        setNote('')
                                    }
                                    if (totalWithIgv <= 0) {
                                        return
                                    }
                                    setIsSheetOpen(isOpen)
                                }
                            }>
                                <SheetTrigger asChild>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Button size="lg" className="bg-primary-dark text-primary-dark-foreground hover:bg-emerald-500" disabled={totalWithIgv <= 0}>
                                            <ShoppingCart className="mr-2 h-5 w-5" /> Pagar S/ {totalWithIgv.toFixed(2)}
                                        </Button>
                                    </motion.div>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-fit">
                                    <SheetHeader>
                                        <SheetTitle className='text-2xl font-bold'>Pago</SheetTitle>
                                        <SheetDescription>
                                            Confirme los detalles de la venta
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-4 space-y-4">
                                        <p>
                                            <strong className='bg-primary text-white text-xs px-2 py-1 rounded-sm'>Total:</strong>{' '}
                                            <span className='text-pretty font-semibold'>S/ {totalWithIgv.toFixed(2)}</span>
                                        </p>
                                        <p>
                                            <strong className='bg-primary text-white text-xs px-2 py-1 rounded-sm'>Tipo de documento:</strong>{' '}
                                            <span className='text-pretty font-semibold'>{documentType}</span>
                                        </p>
                                        <p>
                                            <strong className='bg-primary text-white text-xs px-2 py-1 rounded-sm'>Cliente:</strong>{' '}
                                            <span className='text-pretty font-semibold'>
                                                {selectedCustomer && selectedCustomer.person.legalName ? `${selectedCustomer?.person.legalName}` : `${selectedCustomer?.person.givenNames} ${selectedCustomer?.person.lastName}` || 'CLIENTE VARIOS'}
                                            </span>
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className='text-left w-[140px]'>Método de pago</th>
                                                        <th className='text-left w-[140px]'>Monto</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.values(PaymentMethod).map((method, index) => (
                                                        <tr key={index} className='py-2'>
                                                            <td className='text-center flex flex-row items-center pb-2 w-[140px]'>
                                                                {renderIcon(method)}
                                                                {MapPaymentMethod[method]}
                                                            </td>
                                                            <td className='text-right pb-2 w-[140px]'>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    step={0.01}
                                                                    placeholder="0.00"
                                                                    className='w-full'
                                                                    onChange={(e) => {
                                                                        if (e.target.value === '') {
                                                                            setPaymentMethods(prev => prev.filter(payment => payment.method !== method))
                                                                        }
                                                                        const amount = parseFloat(e.target.value)
                                                                        if (amount > 0) {
                                                                            addPaymentMethod(method, amount)
                                                                        }
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div>
                                            {/* <h3 className="font-bold mb-2">Métodos de pago</h3>
                                            {paymentMethods.map((payment, index) => (
                                                <p key={index}>{payment.method}: S/ {payment.amount.toFixed(2)}</p>
                                            ))} */}
                                            {remainingAmount > 0 && (
                                                <p className="text-red-500">Monto restante: S/ {remainingAmount.toFixed(2)}</p>
                                            )}
                                            {refund > 0.01 && (
                                                <p className="text-green-500">Monto a devolver: S/ {refund.toFixed(2)}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                                Nota de venta
                                            </label>
                                            <Textarea
                                                id="note"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Ingrese una nota para la venta"
                                                className="mt-1"
                                            />
                                        </div>
                                        {useCheckPermission(ModulesRoles.DASHBOARD, ActionRoles.CREATE) && (
                                            <Button
                                                disabled={remainingAmount > 0.01}
                                                className="bg-primary text-white dark:text-white w-full disabled:cursor-not-allowed disabled:bg-primary/100" onClick={async () => {
                                                    if (remainingAmount <= 0) {
                                                        await handleCreateSale()
                                                    } else {
                                                        toast({
                                                            title: 'Error',
                                                            description: 'Por favor, complete el pago total antes de confirmar',
                                                            duration: 5000,
                                                        })
                                                    }
                                                }}>
                                                Confirmar Pago
                                            </Button>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {isOpenDialogCustomer && <CustomerDialog />}
        </div>
    )
}