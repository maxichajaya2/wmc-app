import { api } from "@/api";

export class ReportService {
  static getPapersReport = async () => {
    try {
      const response = await api.get("/reports/papers", {
        responseType: "blob", // Importante para recibir el archivo correctamente
      });

      // Crear un blob a partir de la respuesta
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Crear una URL para el blob
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace temporal para la descarga
      const a = document.createElement("a");
      a.href = url;
      a.download = "trabajos-tecnicos.xlsx"; // Nombre del archivo
      document.body.appendChild(a);
      a.click();

      // Limpiar el enlace temporal
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
    }
  };
}
