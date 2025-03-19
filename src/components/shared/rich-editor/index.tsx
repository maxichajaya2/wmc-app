"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { FontSize } from "./extensions/font-size"
import { HTMLAttributes } from "./extensions/html-attributes"
import { Toolbar } from "./components/toolbar"
import { useEffect, useState } from "react"
import { HtmlDialog } from "./components/html-dialog"
import { SpanNode } from "./components/span-node"
import { DivNode } from "./components/div-node"
import { SvgNode } from "./components/svg-node"
import { PathNode } from "./components/path-node"
import { CircleNode } from "./components/circle-node"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"

interface RichEditorProps {
  initialContent?: string
  onChange?: (html: string) => void
}

export function RichEditor({ initialContent = "", onChange }: RichEditorProps) {
  const [isHtmlDialogOpen, setIsHtmlDialogOpen] = useState(false)
  // const [editorContent, setEditorContent] = useState(initialContent)

  const editor = useEditor({
    extensions: [
      // Use a custom Document extension to allow any content
      Document.extend({
        content: "block+",
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: null,
        },
      }),
      Text,
      StarterKit.configure({
        document: false, // We're using our custom document
        paragraph: false, // We're using our custom paragraph
        text: false, // We're using the default text
        history: {
          newGroupDelay: 500,
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        HTMLAttributes: {
          class: null,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Superscript,
      Subscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: null,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: null,
        },
      }),
      FontSize,
      HTMLAttributes,
      SpanNode,
      DivNode,
      SvgNode,
      PathNode,
      CircleNode,
      // DisableInputRules,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      console.log({onUpdate: true})
      const html = editor.getHTML()
      onChange?.(html)
    },
    parseOptions: {
      preserveWhitespace: "full",
    },
    // This is crucial for preserving HTML attributes
    enablePasteRules: false,
    enableInputRules: false,
  })

  // Update editor content when initialContent changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false)
    }
  }, [editor, initialContent])

  const updateHtml = (html: string) => {
    console.log({html})
    if (editor) {
      editor.commands.setContent(html, true)
      onChange?.(html)
      setIsHtmlDialogOpen(false)
    }
  }

  // Create a simplified HTML view for the editor
  // const createSimplifiedHtml = (html: string) => {
  //   // Replace SVG elements with a placeholder to ensure text around them is visible
  //   const simplifiedHtml = html
  //     .replace(/<svg[^>]*>.*?<\/svg>/gs, "[SVG]")
  //     .replace(/<path[^>]*>/g, "")
  //     .replace(/<circle[^>]*>/g, "")

  //   return simplifiedHtml
  // }

  return (
    <div className="rich-editor border rounded-md bg-gradient-to-r">
      {editor && (
        <>
          <Toolbar editor={editor} onViewHtml={() => setIsHtmlDialogOpen(true)} />
          <div className="p-4">
            <EditorContent editor={editor} className="min-h-[200px] h-full max-w-none" />

            {/* Fallback content display if editor doesn't show content properly */}
            {/* {editor.isEmpty && (
              <div className="mt-4 p-3 border rounded bg-gray-50">
                <div dangerouslySetInnerHTML={{ __html: createSimplifiedHtml(rawHtml) }} />
              </div>
            )} */}
          </div>
          <HtmlDialog
            isOpen={isHtmlDialogOpen}
            onClose={() => setIsHtmlDialogOpen(false)}
            html={editor.getHTML()}
            onUpdate={updateHtml}
          />
        </>
      )}
    </div>
  )
}

