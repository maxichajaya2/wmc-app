
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Eye } from "lucide-react"

interface HtmlDialogProps {
    isOpen: boolean
    onClose: () => void
    html: string
    onUpdate: (html: string) => void
}

export function HtmlDialog({ isOpen, onClose, html, onUpdate }: HtmlDialogProps) {
    const [editedHtml, setEditedHtml] = useState(html)
    const [activeTab, setActiveTab] = useState<"preview" | "code">("code")

    useEffect(() => {
        if (isOpen) {
            setEditedHtml(html)
        }
    }, [isOpen, html])

    const handleUpdate = () => {
        onUpdate(editedHtml)
    }

    const handleFormat = () => {
        try {
            // Simple HTML formatting
            const formatted = formatHTML(editedHtml)
            setEditedHtml(formatted)
        } catch (error) {
            console.error("Error formatting HTML:", error)
            // If formatting fails, keep the original
        }
    }

    // Simple HTML formatter
    const formatHTML = (html: string): string => {
        let formatted = ""
        let indent = 0

        // Remove existing whitespace
        const content = html.replace(/>\s+</g, "><")

        // Add newlines and indentation
        for (let i = 0; i < content.length; i++) {
            const char = content.charAt(i)

            if (char === "<") {
                // Check if this is a closing tag
                if (content.charAt(i + 1) === "/") {
                    indent--
                    formatted += "\n" + " ".repeat(indent * 2)
                } else {
                    formatted += "\n" + " ".repeat(indent * 2)
                    // Don't indent for self-closing tags
                    if (content.charAt(i + 1) !== "!" && !content.substring(i, i + 20).includes("/>")) {
                        indent++
                    }
                }
            }

            formatted += char
        }

        return formatted
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>
                        Ver/Editar HTML
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "preview" | "code")}>
                        <TabsList className="mb-2">
                            <TabsTrigger value="code" className="flex items-center gap-2">
                                <Code size={16} />
                                Código HTML
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="flex items-center gap-2">
                                <Eye size={16} />
                                Vista previa
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="code" className="mt-0">
                            <div className="flex justify-end mb-2">
                                <Button variant="outline" onClick={handleFormat}>
                                    Format HTML
                                </Button>
                            </div>
                            <Textarea
                                className="font-mono min-h-[400px]"
                                value={editedHtml}
                                onChange={(e) => setEditedHtml(e.target.value)}
                            />
                        </TabsContent>

                        <TabsContent value="preview" className="mt-0 border p-4 rounded-md h-[400px] overflow-auto resize-y">
                            <div dangerouslySetInnerHTML={{ __html: editedHtml }} />
                        </TabsContent>
                    </Tabs>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleUpdate}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

