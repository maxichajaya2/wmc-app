import { Node, mergeAttributes } from "@tiptap/core"

// This extension creates a circle node for SVG circles
export const CircleNode = Node.create({
    name: "circle",
    group: "inline",
    inline: true,
    atom: true, // Treat as a single unit

    parseHTML() {
        return [{ tag: "circle" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["circle", mergeAttributes(HTMLAttributes), 0]
    },

    addAttributes() {
        return {
            cx: {
                default: null,
                parseHTML: (element) => element.getAttribute("cx"),
            },
            cy: {
                default: null,
                parseHTML: (element) => element.getAttribute("cy"),
            },
            r: {
                default: null,
                parseHTML: (element) => element.getAttribute("r"),
            },
            fill: {
                default: null,
                parseHTML: (element) => element.getAttribute("fill"),
            },
            stroke: {
                default: null,
                parseHTML: (element) => element.getAttribute("stroke"),
            },
        }
    },
})

