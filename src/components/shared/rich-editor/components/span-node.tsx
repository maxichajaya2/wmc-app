import { Node, mergeAttributes } from "@tiptap/core"

// This extension creates a span node that preserves all attributes
export const SpanNode = Node.create({
  name: "span",
  group: "inline",
  inline: true,
  content: "inline*",
  parseHTML() {
    return [{ tag: "span" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0]
  },
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
      },
      // Add any other attributes you want to preserve
    }
  },
})

