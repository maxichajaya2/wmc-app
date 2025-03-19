import { Extension } from "@tiptap/core"

// This extension preserves HTML attributes that would otherwise be stripped
export const HTMLAttributes = Extension.create({
  name: "htmlAttributes",

  addGlobalAttributes() {
    return [
      {
        // Remove 'text' from this array - text nodes cannot have attributes
        types: ["paragraph", "heading", "bulletList", "orderedList", "listItem"],
        attributes: {
          class: {
            default: null,
            parseHTML: (element) => element.getAttribute("class"),
            renderHTML: (attributes) => {
              if (!attributes.class) {
                return {}
              }

              return {
                class: attributes.class,
              }
            },
          },
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute("style"),
            renderHTML: (attributes) => {
              if (!attributes.style) {
                return {}
              }

              return {
                style: attributes.style,
              }
            },
          },
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute("id"),
            renderHTML: (attributes) => {
              if (!attributes.id) {
                return {}
              }

              return {
                id: attributes.id,
              }
            },
          },
        },
      },
    ]
  },
})

