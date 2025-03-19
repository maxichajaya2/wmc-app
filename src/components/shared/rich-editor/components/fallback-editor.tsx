"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface FallbackEditorProps {
    html: string
    onChange: (html: string) => void
}

export function FallbackEditor({ html, onChange }: FallbackEditorProps) {
    const [textContent, setTextContent] = useState("")

    useEffect(() => {
        // Extract text content from HTML
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        setTextContent(tempDiv.textContent || tempDiv.innerText || "")
    }, [html])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextContent(e.target.value)

        // Create a simple HTML representation of the text
        const newHtml = `<div>${e.target.value
            .split("\n")
            .map((line) => `<p>${line}</p>`)
            .join("")}</div>`
        onChange(newHtml)
    }

    return (
        <div className="fallback-editor">
            <textarea className="w-full min-h-[200px] p-2 border rounded" value={textContent} onChange={handleChange} />
        </div>
    )
}

