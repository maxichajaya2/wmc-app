import { Extension } from "@tiptap/core";

// This extension helps preserve HTML structure when pasting content
export const PreserveHtml = Extension.create({
  name: "preserveHtml",

  addPasteRules() {
    return [
      {
        find: /<([a-z][a-z0-9]*)(?:\s+([^>]*))?(?:\/)?>/gi,
        handler: ({ match, chain: _chain }) => {
          const [_fullMatch, tagName, _attributes] = match;

          // Don't process these tags
          if (["script", "style"].includes(tagName.toLowerCase())) {
            return;
          }

          return; // Let the default HTML parser handle it
        },
      },
    ];
  },
});
