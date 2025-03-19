import { Node, mergeAttributes } from "@tiptap/core"

// This extension creates a div node that preserves all attributes and content
export const DivNode = Node.create({
    name: "div",
    group: "block",
    content: "block*",

    parseHTML() {
        return [{ tag: "div" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes), 0]
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
            id: {
                default: null,
                parseHTML: (element) => element.getAttribute("id"),
            },
            "data-aos": {
                default: null,
                parseHTML: (element) => element.getAttribute("data-aos"),
            },
            // Add any other attributes you want to preserve
        }
    },
})

