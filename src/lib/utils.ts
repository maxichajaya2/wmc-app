import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toLocalISOString(dateString: string) {
  // Crear la fecha con la hora local en 00:00:00
  const date = new Date(`${dateString}T00:00:00`);

  // Obtener el offset de la zona horaria en minutos
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const minutes = String(Math.abs(offset) % 60).padStart(2, "0");

  // Formatear fecha en "YYYY-MM-DDT00:00:00"
  const formattedDate = `${dateString}T00:00:00`;

  return `${formattedDate}${sign}${hours}:${minutes}`;
}

// Función que obtiene el peso de un archivo en bytes
export async function getFileSize(urlImage: string) {
  const value: Promise<number> = new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", urlImage, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        resolve(parseInt(xhr.getResponseHeader("Content-Length") || "0", 10));
      }
    };
    xhr.send();
  });

  // ahora formatear si está en kb, mb, gb
  const formatSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  return value.then((size) => formatSize(size));
}

// A simple HTML formatter
export function formatHTML(html: string): string {
  let formatted = "";
  let indent = 0;

  // Remove existing whitespace
  const content = html.replace(/\s+</g, "<").replace(/>\s+/g, ">");

  // Add newlines and indentation
  for (let i = 0; i < content.length; i++) {
    const char = content.charAt(i);

    if (char === "<") {
      // Check if this is a closing tag
      if (content.charAt(i + 1) === "/") {
        indent--;
        formatted += "\n" + " ".repeat(indent * 2);
      } else if (content.charAt(i + 1) !== "!") {
        // Skip comments
        formatted += "\n" + " ".repeat(indent * 2);
        // Don't indent for self-closing tags or HTML comments
        if (
          content.substr(i, 4) !== "<!--" &&
          content.substr(i + 1, 3) !== "img" &&
          content.substr(i + 1, 2) !== "br" &&
          content.substr(i + 1, 4) !== "path"
        ) {
          indent++;
        }
      }
    } else if (char === ">" && content.charAt(i - 1) === "/") {
      // Self-closing tag, don't change indent
    } else if (char === ">") {
      // Check if this was a self-closing tag
      if (content.charAt(i - 1) === "/") {
        // Do nothing
      } else if (content.substr(i - 2, 2) === "--") {
        // End of comment, do nothing
      } else if (
        content.substr(i - 3, 3) === "svg" ||
        content.substr(i - 4, 4) === "path" ||
        content.substr(i - 6, 6) === "circle"
      ) {
        // SVG tags, don't change indent
      } else {
        // Check if the next tag is a closing tag
        const nextTagStart = content.indexOf("<", i);
        if (nextTagStart > -1 && content.charAt(nextTagStart + 1) === "/") {
          indent--;
        }
      }
    }

    formatted += char;
  }

  return formatted;
}
