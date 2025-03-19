"use client"

import type { Editor } from "@tiptap/react"
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Superscript,
    Subscript,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Highlighter,
    LinkIcon,
    ImageIcon,
    FileCode,
    BrushIcon as Color,
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui"

interface ToolbarProps {
    editor: Editor
    onViewHtml: () => void
}

export function Toolbar({ editor, onViewHtml }: ToolbarProps) {
    const [linkUrl, setLinkUrl] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    const fontSizes = [
        { value: "12px", label: "12px" },
        { value: "14px", label: "14px" },
        { value: "16px", label: "16px" },
        { value: "18px", label: "18px" },
        { value: "20px", label: "20px" },
        { value: "24px", label: "24px" },
        { value: "30px", label: "30px" },
        { value: "36px", label: "36px" },
        { value: "48px", label: "48px" },
    ]

    const setLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
        } else {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
        }
    }

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl("")
        }
    }

    return (
        <div className="border-b p-1 flex flex-wrap gap-1 items-center">
            <Select
                value={
                    editor.isActive("heading", { level: 1 })
                        ? "h1"
                        : editor.isActive("heading", { level: 2 })
                            ? "h2"
                            : editor.isActive("heading", { level: 3 })
                                ? "h3"
                                : editor.isActive("heading", { level: 4 })
                                    ? "h4"
                                    : editor.isActive("heading", { level: 5 })
                                        ? "h5"
                                        : editor.isActive("heading", { level: 6 })
                                            ? "h6"
                                            : "paragraph"
                }
                onValueChange={(value) => {
                    if (value === "paragraph") {
                        editor.chain().focus().setParagraph().run()
                    } else {
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: Number.parseInt(value.replace("h", "")) as unknown as any })
                            .run()
                    }
                }}
            >
                <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Paragraph" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="paragraph">Párrafo</SelectItem>
                    <SelectItem value="h1">H1</SelectItem>
                    <SelectItem value="h2">H2</SelectItem>
                    <SelectItem value="h3">H3</SelectItem>
                    <SelectItem value="h4">H4</SelectItem>
                    <SelectItem value="h5">H5</SelectItem>
                    <SelectItem value="h6">H6</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={editor.getAttributes("textStyle").fontSize || "16px"}
                onValueChange={(value) => {
                    editor.chain().focus().setFontSize(value).run()
                }}
            >
                <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="16px" />
                </SelectTrigger>
                <SelectContent>
                    {fontSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                            {size.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                aria-label="Toggle bold"
                about="Negrita"
            >
                <Bold className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                aria-label="Toggle italic"
                about="Cursiva"
            >
                <Italic className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                aria-label="Toggle underline"
                about="Subrayado"
            >
                <Underline className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                aria-label="Toggle strikethrough"
                about="Tachado"
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
                aria-label="Toggle monospace"
                about="Código"
            >
                <Code className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
                size="sm"
                pressed={editor.isActive("superscript")}
                onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
                aria-label="Toggle superscript"
                about="Superíndice"
            >
                <Superscript className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("subscript")}
                onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
                aria-label="Toggle subscript"
                about="Subíndice"
            >
                <Subscript className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                aria-label="Toggle bullet list"
                about="Lista"
            >
                <List className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                aria-label="Toggle ordered list"
                about="Lista numerada"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                aria-label="Align left"
                about="Alinear a la izquierda"
            >
                <AlignLeft className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                aria-label="Align center"
                about="Alinear al centro"
            >
                <AlignCenter className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                aria-label="Align right"
                about="Alinear a la derecha"
            >
                <AlignRight className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
                aria-label="Align justify"
                about="Justificar"
            >
                <AlignJustify className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
                size="sm"
                pressed={editor.isActive("highlight")}
                onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
                aria-label="Toggle highlight"
                about="Resaltar"
            >
                <Highlighter className="h-4 w-4" />
            </Toggle>

            <Popover modal={true}>
                <PopoverTrigger asChild>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" type="button" className="h-8 w-8">
                                    <Color className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Color Texto</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="color">Color texto</Label>
                            <Input
                                id="color"
                                type="color"
                                onChange={(e) => {
                                    editor.chain().focus().setColor(e.target.value).run()
                                }}
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <Popover modal>
                <PopoverTrigger asChild>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" type="button" size="icon" className="h-8 w-8">
                                    <LinkIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Link URL</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="link">Link URL</Label>
                            <Input
                                id="link"
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                        </div>
                        <Button type="button" onClick={setLink}>{editor.isActive("link") ? "Actualizar Link" : "Agregar Link"}</Button>
                        {editor.isActive("link") && (
                            <Button type="button" variant="outline" onClick={() => editor.chain().focus().unsetLink().run()}>
                                Quitar Link
                            </Button>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="button" variant="outline" size="icon" className="h-8 w-8">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Imagen URL</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </PopoverTrigger>
                <PopoverContent className="w-80 z-50 relative">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="image">Imagen URL</Label>
                            <Input
                                id="image"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                        <Button type="button" onClick={addImage}>Agregar Imagen</Button>
                    </div>
                </PopoverContent>
            </Popover>


            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" type="button" size="icon" className="h-8 w-8 ml-auto" onClick={onViewHtml}>
                            <FileCode className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>HTML Editor</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

