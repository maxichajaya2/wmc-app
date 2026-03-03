"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@/components";
import { formatDate } from "@/utils/format-date";
import {
  LoaderCircle,
  Pencil,
  Trash2,
  ExternalLink,
  Paperclip,
} from "lucide-react";
import mammoth from "mammoth";
import { useEffect, useState, useRef } from "react";
import { usePaperStore } from "../../store/papers.store";
import { useCommentPapers } from "./useCommentPapers";
import ConfirmDeleteComment from "./ConfirmDeleteComment";

function CommentsDialog() {
  const {
    isOpenCommentsDialog,
    closeCommentsDialog,
    comments,
    loading,
    errors,
    register,
    handleSubmit,
    onSubmit,
    handleEdit,
    handleFileUpload,
    uploading,
    watch,
    selectedBlockId,
    setSelectedBlockId,
    editingCommentId,
    openConfirmDeleteComment,
  } = useCommentPapers();

  const selected = usePaperStore((state) => state.selected);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [converting, setConverting] = useState(false);
  const docContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpenCommentsDialog) {
      if (selected?.fullFileUrl) {
        loadDocument(selected.fullFileUrl);
      } else if (selected?.file) {
        loadDocument(selected.file);
      }
    } else {
      setHtmlContent("");
      setSelectedBlockId(null);
    }
  }, [isOpenCommentsDialog, selected, setSelectedBlockId]);

  // Effect to handle paragraph highlighting
  useEffect(() => {
    if (!docContainerRef.current) return;

    // Remove previous highlighting
    const prev = docContainerRef.current.querySelector(".selected-paragraph");
    if (prev) prev.classList.remove("selected-paragraph");

    // Add new highlighting
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
      const response = await fetch(url);
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
      setHtmlContent(
        "<p class='text-red-500'>Error loading document. Please check if the file URL is accessible.</p>",
      );
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
    const element = docContainerRef.current?.querySelector(
      `[data-block="${blockId}"]`,
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setSelectedBlockId(blockId);
    }
  };

  return (
    <>
      <style>{`
        .selected-paragraph {
          background-color: #fff3b0 !important;
          transition: background 0.2s ease;
          border-left: 4px solid #eab308 !important;
          padding-left: 8px !important;
        }
        .document-viewer .doc-p:hover {
          background-color: #f3f4f6;
        }
        .document-viewer img {
          max-width: 100%;
          height: auto;
          margin: 10px 0;
        }
      `}</style>
      <Dialog open={isOpenCommentsDialog} onOpenChange={closeCommentsDialog}>
        <DialogContent
          className="!max-w-[98%] !h-[90vh] flex flex-col"
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-blue-600">Comments</span>
              <span className="text-gray-400 font-normal">|</span>
              <span className="truncate max-w-[50vw]">
                {selected?.title || "Document View"}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-4 flex-grow overflow-hidden pt-4">
            <div className="w-full flex md:flex-1 border rounded-md p-6 bg-white overflow-y-auto document-viewer shadow-inner h-[200px] md:min-h-full">
              {converting ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <LoaderCircle
                    className="animate-spin text-blue-500"
                    size={48}
                  />
                  <p className="text-gray-500 font-medium">
                    Converting document...
                  </p>
                </div>
              ) : htmlContent ? (
                <div
                  ref={docContainerRef}
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  onClick={handleParagraphClick}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No document content available.
                </div>
              )}
            </div>
            <div className="md:w-1/3 xl:w-[450px] flex flex-col gap-4 overflow-hidden border rounded-md bg-gray-100/30 p-1">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 bg-white border-b shrink-0 shadow-sm"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Pencil size={14} className="text-blue-500" />
                      {editingCommentId ? "Edit Comment" : "Add Comment"}
                    </span>
                    {selectedBlockId && (
                      <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Paragraph #{selectedBlockId}
                      </span>
                    )}
                  </div>

                  <Input
                    {...register("comentary")}
                    placeholder={
                      selectedBlockId
                        ? `Comment on paragraph ${selectedBlockId}...`
                        : "Write a general comment..."
                    }
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  />

                  <input
                    type="hidden"
                    {...register("blockId", { valueAsNumber: true })}
                  />

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 group">
                        <Input
                          type="file"
                          onChange={(e) => handleFileUpload(e)}
                          disabled={uploading}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 border border-dashed border-gray-300 rounded px-2 py-1 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                          <Paperclip size={12} />
                          <span>
                            {watch("fileUrl") ? "Change file" : "Attach file"}
                          </span>
                        </div>
                      </div>
                      {selectedBlockId && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedBlockId(null)}
                          className="h-7 text-[10px] text-gray-400 hover:text-red-500"
                        >
                          Clear Selection
                        </Button>
                      )}
                    </div>

                    {uploading && (
                      <div className="flex items-center space-x-2 text-xs">
                        <LoaderCircle
                          size={14}
                          className="animate-spin text-blue-500"
                        />
                        <span className="text-blue-500">Uploading file...</span>
                      </div>
                    )}

                    {watch("fileUrl") && (
                      <div className="text-[10px] bg-blue-50 p-2 rounded border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-700 truncate mr-2">
                          <Paperclip size={10} />
                          <span className="truncate">File attached</span>
                        </div>
                        <a
                          href={watch("fileUrl") || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-bold hover:underline flex items-center gap-1 shrink-0"
                        >
                          View <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full h-9 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-sm transition-all"
                  >
                    {loading ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : editingCommentId ? (
                      "Update Comment"
                    ) : (
                      "Post Comment"
                    )}
                  </Button>
                </div>
                {errors.comentary && (
                  <p className="text-[10px] text-red-500 mt-2 italic">
                    {errors.comentary.message}
                  </p>
                )}
              </form>

              <ScrollArea className="flex-grow p-3">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                    Discussion
                  </h3>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                    {comments.length}
                  </span>
                </div>

                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <p className="text-xs">No comments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`group p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          comment.blockId === selectedBlockId
                            ? "bg-amber-50/70 border-amber-200 shadow-sm"
                            : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-xs"
                        }`}
                        onClick={() => scrollToBlock(comment.blockId)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-blue-900 truncate">
                                {comment.user?.name}
                              </span>
                              {comment.blockId && (
                                <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold border border-blue-100">
                                  P#{comment.blockId}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-gray-400 block mt-0.5">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>

                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              type="button"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(comment);
                              }}
                              disabled={loading}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                openConfirmDeleteComment(comment.id);
                              }}
                              disabled={loading}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {comment.comentary}
                        </p>

                        {comment.fileUrl && (
                          <div className="mt-3 pt-2 border-t border-gray-50 flex justify-end">
                            <a
                              href={comment.fileUrl || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>View attachment</span>
                              <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
          <DialogFooter className="shrink-0 mt-4 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeCommentsDialog}
              className="px-8"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteComment />
    </>
  );
}

export default CommentsDialog;
