"use client"

import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportService } from "./services/reports.service"
import { useState } from "react"
import { toast } from "@/components"

export default function ReportsPage() {
    const [loading, setLoading] = useState(false)
    const handleDownloadExcel = async () => {
        setLoading(true)
        try {
            await ReportService.getPapersReport({})
            toast({
                title: "Descarga exitosa",
                description: "El informe de trabajos técnicos se ha descargado correctamente.",
            })
        } catch (error) {
            console.error("Error downloading report:", error)
            toast({
                title: "Error",
                description: "No se pudo descargar el informe de trabajos técnicos.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="min-h-screen p-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight ">
                        Reportes
                    </h1>
                    <p className="mt-2 text-slate-800">Descarga informes.</p>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* <Card className="bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-white">Reporte Financiero</CardTitle>
                            <CardDescription className="text-slate-400">Datos financieros del mes actual</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white"
                                onClick={() => handleDownloadExcel("financiero")}
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                                Descargar Excel
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-white">Reporte de Ventas</CardTitle>
                            <CardDescription className="text-slate-400">Análisis de ventas por región</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white"
                                onClick={() => handleDownloadExcel("ventas")}
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                                Descargar Excel
                            </Button>
                        </CardContent>
                    </Card> */}

                    <Card className=" backdrop-blur-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-black">Trabajos Técnicos</CardTitle>
                            <CardDescription className="text-slate-700">
                                Reporte total de trabajos técnicos realizados.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white
                                disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                                onClick={handleDownloadExcel}
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                                Descargar Excel
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* <div className="mt-12">
                    <Card className="bg-slate-900/30 border border-slate-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-white text-xl">Reportes Programados</CardTitle>
                            <CardDescription className="text-slate-400">
                                Configura reportes automáticos para tu equipo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Configurar Reportes
                                </Button>
                                <Button variant="ghost" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                                    Ver Historial
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-slate-700 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Reportes Personalizados</h2>
                    <p className="text-slate-400 mb-6">Crea reportes a medida según tus necesidades específicas</p>
                    <Button className="bg-white text-slate-900 hover:bg-slate-100">Crear Reporte Personalizado</Button>
                </div> */}
            </div>
        </div>
    )
}

