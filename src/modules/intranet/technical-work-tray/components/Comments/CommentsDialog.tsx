"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  Separator,
} from "@/components";
import { formatDate } from "@/utils/format-date";
import {
  LoaderCircle,
  ExternalLink,
  Paperclip,
  FileText,
  Eye,
} from "lucide-react";
import mammoth from "mammoth";
import { useEffect, useState, useRef, useMemo } from "react";
import { usePaperStore } from "../../store/papers.store";
import { useCommentPapers } from "./useCommentPapers";

function CommentsDialog() {
  const {
    isOpenCommentsDialog,
    closeCommentsDialog,
    comments,
    selectedBlockId,
    setSelectedBlockId,
  } = useCommentPapers();

  const selected = usePaperStore((state) => state.selected);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [converting, setConverting] = useState(false);

  // ESTADOS DE CONTROL DE VERSIÓN
  const [currentVersionKey, setCurrentVersionKey] = useState<string>("Actual");
  const [currentDocUrl, setCurrentDocUrl] = useState<string>("");

  const docContainerRef = useRef<HTMLDivElement>(null);

  // EFECTO PRINCIPAL: Carga inicial del documento
  useEffect(() => {
    if (isOpenCommentsDialog && selected) {
      const initialUrl = selected.fullFileUrl || selected.file;
      if (initialUrl) {
        setCurrentVersionKey("Actual");
        setCurrentDocUrl(initialUrl);
        loadDocument(initialUrl);
      }
    } else {
      setHtmlContent("");
      setSelectedBlockId(null);
      setCurrentDocUrl("");
    }
  }, [isOpenCommentsDialog, selected?.id]);

  // FILTRADO DE COMENTARIOS: Solo muestra los de la versión activa en el visor
  const filteredComments = useMemo(() => {
    return comments.filter((c: any) => c.documentVersion === currentVersionKey);
  }, [comments, currentVersionKey]);

  // EFECTO DE RESALTADO (HIGHLIGHT)
  useEffect(() => {
    if (!docContainerRef.current) return;
    const prev = docContainerRef.current.querySelector(".selected-paragraph");
    if (prev) prev.classList.remove("selected-paragraph");

    if (selectedBlockId) {
      const current = docContainerRef.current.querySelector(
        `[data-block="${selectedBlockId}"]`,
      );
      if (current) {
        current.classList.add("selected-paragraph");
      }
    }
  }, [selectedBlockId, htmlContent]);

  const loadDocument = async (url: string) => {
    setConverting(true);
    try {
      const response = await fetch(`${url}?t=${new Date().getTime()}`);
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      // Post-process to add data-block IDs
      const parser = new DOMParser();
      const doc = parser.parseFromString(result.value, "text/html");
      const paragraphs = doc.querySelectorAll("p");
      paragraphs.forEach((p, index) => {
        p.setAttribute("data-block", (index + 1).toString());
        p.style.cursor = "pointer";
        p.style.padding = "4px";
        p.style.borderRadius = "4px";
        p.classList.add("doc-p");
      });

      setHtmlContent(doc.body.innerHTML);
    } catch (error) {
      console.error("Error converting document:", error);
      setHtmlContent("<p class='text-red-500 font-bold p-4'>Error al cargar el documento.</p>");
    } finally {
      setConverting(false);
    }
  };

  const handleParagraphClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const paragraph = target.closest("p");
    if (!paragraph) return;
    const blockId = paragraph.getAttribute("data-block");
    if (!blockId) return;
    setSelectedBlockId(Number(blockId));
  };

  const scrollToBlock = (blockId?: number) => {
    if (!blockId) return;
    const element = docContainerRef.current?.querySelector(`[data-block="${blockId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setSelectedBlockId(blockId);
    }
  };

  // SUB-COMPONENTE PARA LINKS DE VERSIONES
  const VersionLink = ({ label, url, versionKey }: { label: string; url?: string | null; versionKey: string }) => {
    if (!url) return null;

    const versionCommentsCount = comments.filter((c: any) => c.documentVersion === versionKey).length;
    const isActive = currentVersionKey === versionKey;

    return (
      <div className={`flex items-center justify-between p-2 rounded-lg border transition-all ${isActive ? "bg-blue-50 border-blue-300 ring-1 ring-blue-100" : "bg-white border-gray-100"}`}>
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-gray-700">{label}</span>
          {versionCommentsCount > 0 && (
            <span className="text-[9px] text-blue-500 font-bold">{versionCommentsCount} comentarios</span>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant={isActive ? "default" : "ghost"}
            className={`h-6 w-6 ${isActive ? "bg-blue-600" : "text-blue-600"}`}
            onClick={() => {
              setCurrentVersionKey(versionKey);
              setCurrentDocUrl(url);
              loadDocument(url);
              setSelectedBlockId(null);
            }}
          >
            <Eye size={12} />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400" onClick={() => window.open(url, "_blank")}>
            <ExternalLink size={12} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .selected-paragraph { background-color: #fff3b0 !important; transition: background 0.2s ease; border-left: 4px solid #eab308 !important; padding-left: 8px !important; }
        .document-viewer .doc-p:hover { background-color: #f3f4f6; }
      `}</style>

      <Dialog open={isOpenCommentsDialog} onOpenChange={closeCommentsDialog}>
        <DialogContent className="!max-w-[98%] !h-[95vh] flex flex-col p-4" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">Comentarios de Evaluación</span>
              <span className="text-gray-300">|</span>
              <span className="truncate max-w-[40vw] text-gray-600 font-medium text-sm">{selected?.title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-4 flex-grow overflow-hidden pt-4">
            {/* DERECHA: VISOR DE DOCUMENTO */}
            <div className="w-full flex md:flex-1 border rounded-xl bg-white overflow-hidden shadow-sm flex-col">
              <div className="bg-gray-50 border-b p-2 flex justify-between items-center px-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visor</span>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-blue-600" onClick={() => currentDocUrl && window.open(currentDocUrl, "_blank")}>
                  <ExternalLink size={12} className="mr-1" /> Ver archivo externo
                </Button>
              </div>
              <ScrollArea className="flex-grow p-8 document-viewer bg-[#fdfdfd]">
                {converting ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
                    <LoaderCircle className="animate-spin text-blue-500" size={40} />
                    <p className="text-sm text-gray-400">Cargando contenido...</p>
                  </div>
                ) : (
                  <div ref={docContainerRef} className="prose prose-sm max-w-none w-full" dangerouslySetInnerHTML={{ __html: htmlContent }} onClick={handleParagraphClick} />
                )}
              </ScrollArea>
            </div>
            {/* IZQUIERDA: HISTORIAL Y FEEDBACK (SOLO LECTURA) */}
            <div className="md:w-[400px] xl:w-[460px] flex flex-col gap-3 overflow-y-auto">
              {/* SECCIÓN DE VERSIONES */}
              <div className="bg-white border rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700">
                  <FileText className="w-4 h-4 text-blue-600" /> Historial de Archivos
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fase 1 (Abstract)</p>
                    <VersionLink label="P1 Actual" url={selected?.file} versionKey="Actual" />
                    <VersionLink label="P1 V1" url={selected?.fileVersion1} versionKey="V1" />
                    <VersionLink label="P1 V2" url={selected?.fileVersion2} versionKey="V2" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fase 2 (Trabajo Final)</p>
                    <VersionLink label="P2 Actual" url={selected?.fullFileUrl} versionKey="Actual" />
                    <VersionLink label="P2 V1" url={selected?.fullFileUrlVersion1} versionKey="V1" />
                    <VersionLink label="P2 V2" url={selected?.fullFileUrlVersion2} versionKey="V2" />
                  </div>
                </div>
              </div>

              {/* LISTA FILTRADA DE COMENTARIOS */}
              <div className="bg-white border rounded-xl flex-grow flex flex-col shadow-sm min-h-[300px]">
                <div className="p-3 border-b bg-gray-50/50 flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retroalimentación ({currentVersionKey})</h3>
                  <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{filteredComments.length}</span>
                </div>
                <ScrollArea className="flex-grow p-3">
                  <div className="space-y-4">
                    {filteredComments.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 text-xs italic">No hay comentarios en esta versión.</div>
                    ) : (
                      filteredComments.map((comment: any) => (
                        <div key={comment.id} className={`group p-3 rounded-xl border transition-all cursor-pointer ${comment.blockId === selectedBlockId ? "bg-amber-50 border-amber-200 ring-1 ring-amber-100" : "bg-white border-gray-100 hover:border-gray-200"}`} onClick={() => scrollToBlock(comment.blockId)}>
                          <div className="flex justify-between items-start mb-1">
                            <div className="min-w-0">
                              <span className="font-bold text-[11px] text-blue-900 block truncate">{comment.user?.name}</span>
                              <span className="text-[8px] text-gray-400 uppercase">{formatDate(comment.createdAt)}</span>
                            </div>
                          </div>
                          <p className="text-[12px] text-gray-700 leading-snug mt-1">{comment.comentary}</p>
                          {comment.fileUrl && (
                            <a href={comment.fileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 hover:bg-blue-50 p-1 px-2 rounded-md border border-blue-100">
                              <Paperclip size={10} /> Ver evidencia
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>


          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}

export default CommentsDialog;


