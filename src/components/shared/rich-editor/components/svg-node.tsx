import { Node } from "@tiptap/core"

function unescapeHTML(html: string) {
    const element = document.createElement("div")
    element.innerHTML = html
    console.log({textContent: element.innerHTML?.trim()})
    return element.innerHTML
  }

export const SvgNode = Node.create({
    name: "svg",
    group: "inline",
    inline: true,
    atom: true, // Treat as a single unit

    // Parsear el HTML para detectar el nodo SVG y capturar su contenido interno
    parseHTML() {
        return [
            {
                tag: "svg",
                getAttrs: (element) => {
                    // Extraer el contenido interno del SVG
                    const innerHTML = element.innerHTML || ""

                    // Retornar los atributos del SVG junto con el contenido interno
                    return {
                        xmlns: element.getAttribute("xmlns"),
                        width: element.getAttribute("width"),
                        height: element.getAttribute("height"),
                        viewBox: element.getAttribute("viewBox"),
                        fill: element.getAttribute("fill"),
                        stroke: element.getAttribute("stroke"),
                        "stroke-width": element.getAttribute("stroke-width"),
                        "stroke-linecap": element.getAttribute("stroke-linecap"),
                        "stroke-linejoin": element.getAttribute("stroke-linejoin"),
                        class: element.getAttribute("class"),
                        textContent: innerHTML, // Capturar el contenido interno
                    }
                },
            },
        ]
    },

    renderHTML({ node, HTMLAttributes: _ }) {
        //     // Extraer el contenido interno del SVG
        const innerHTML = unescapeHTML(node.attrs.textContent.trim()) || ""
        // // Crear un elemento temporal para analizar el HTML interno
        const tempElement = document.createElement("div")
        tempElement.innerHTML = innerHTML

        // const children = Array.from(innerHTML.children)

        // Renderizar el SVG con su contenido interno
        return [
            "div",
            { contenteditable: "false" }, // Evitar que el editor manipule el SVG
            [
                "svg",
                {
                    xmlns: node.attrs.xmlns,
                    width: node.attrs.width,
                    height: node.attrs.height,
                    viewBox: node.attrs.viewBox,
                    fill: node.attrs.fill,
                    stroke: node.attrs.stroke,
                    "stroke-width": node.attrs["stroke-width"],
                    "stroke-linecap": node.attrs["stroke-linecap"],
                    "stroke-linejoin": node.attrs["stroke-linejoin"],
                    class: node.attrs.class,
                },
                ...Array.from(tempElement.children),
            ],
        ]
    },

    addAttributes() {
        return {
            xmlns: {
                default: null,
                parseHTML: (element) => element.getAttribute("xmlns"),
            },
            width: {
                default: null,
                parseHTML: (element) => element.getAttribute("width"),
            },
            height: {
                default: null,
                parseHTML: (element) => element.getAttribute("height"),
            },
            viewBox: {
                default: null,
                parseHTML: (element) => element.getAttribute("viewBox"),
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
            "stroke-linecap": {
                default: null,
                parseHTML: (element) => element.getAttribute("stroke-linecap"),
            },
            "stroke-linejoin": {
                default: null,
                parseHTML: (element) => element.getAttribute("stroke-linejoin"),
            },
            class: {
                default: null,
                parseHTML: (element) => element.getAttribute("class"),
            },
            textContent: {
                default: null,
                parseHTML: (element) => element.getAttribute("textContent"),
            },
            innerHTML: {
                default: "",
            },
        }
    },

})