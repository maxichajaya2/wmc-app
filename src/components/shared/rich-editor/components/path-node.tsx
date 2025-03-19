import { Node, mergeAttributes } from "@tiptap/core"

// This extension creates a path node for SVG paths
export const PathNode = Node.create({
    name: "path",
    group: "inline",
    inline: true,
    atom: true, // Treat as a single unit

    parseHTML() {
        return [{ tag: "path" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["path", mergeAttributes(HTMLAttributes), 0]
    },

    addAttributes() {
        return {
            d: {
                default: null,
                parseHTML: (element) => element.getAttribute("d"),
            },
            fill: {
                default: null,
                parseHTML: (element) => element.getAttribute("fill"),
            },
            stroke: {
                default: null,
                parseHTML: (element) => element.getAttribute("stroke"),
            },
            "stroke-width": {
                default: null,
                parseHTML: (element) => element.getAttribute("stroke-width"),
            },
        }
    },
})

