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
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import mammoth from "mammoth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePaperStore } from "../../store/papers.store";
import { useCommentPapers } from "./useCommentPapers";

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
  } = useCommentPapers();

  const setDeletingCommentId = usePaperStore(
    (state) => state.setDeletingCommentId,
  );

  const selected = usePaperStore((state) => state.selected);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (isOpenCommentsDialog && selected?.fullFileUrl) {
      loadDocument(selected.fullFileUrl);
    } else {
      setHtmlContent("");
      setSelectedBlockId(null);
    }
  }, [isOpenCommentsDialog, selected, setSelectedBlockId]);

  const loadDocument = async (url: string) => {
    setConverting(true);
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          transformDocument: (element: any) => {
            return element;
          },
        },
      );

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
    const element = document.querySelector(`[data-block="${blockId}"]`);
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
          border: 1px solid #eab308;
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
            <DialogTitle>
              Comments - {selected?.title || "Document View"}
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
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  onClick={handleParagraphClick}
                  ref={(el) => {
                    if (el && selectedBlockId) {
                      const prev = el.querySelector(".selected-paragraph");
                      if (prev) prev.classList.remove("selected-paragraph");
                      const current = el.querySelector(
                        `[data-block="${selectedBlockId}"]`,
                      );
                      if (current) current.classList.add("selected-paragraph");
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No document content available.
                </div>
              )}
            </div>
            <div className="md:w-1/3 xl:w-[450px] flex flex-col gap-4 overflow-hidden border rounded-md bg-gray-50/50 p-1">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-3 bg-white border-b shrink-0"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">
                      Add Comment
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
                    className="bg-white"
                  />

                  <input
                    type="hidden"
                    {...register("blockId", { valueAsNumber: true })}
                  />

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        onChange={(e) => handleFileUpload(e)}
                        disabled={uploading}
                        className="cursor-pointer text-xs file:bg-blue-50 file:text-blue-700 border-none p-0 h-auto"
                      />
                      {selectedBlockId && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedBlockId(null)}
                          className="h-7 text-[10px] text-gray-500"
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
                      <div className="text-xs bg-blue-50 p-2 rounded border border-blue-100 flex items-center justify-between">
                        <span className="text-blue-700 truncate max-w-[200px]">
                          File attached
                        </span>
                        <Link
                          to={watch("fileUrl") || ""}
                          target="_blank"
                          className="text-blue-600 font-bold hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full h-9 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-sm"
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
                  <p className="text-xs text-red-500 mt-2 italic">
                    {errors.comentary.message}
                  </p>
                )}
              </form>

              <ScrollArea className="flex-grow p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">
                    Discussion
                  </h3>
                  <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                    {comments.length}
                  </span>
                </div>

                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <p className="text-xs">No comments found for this paper.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`group p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          comment.blockId === selectedBlockId
                            ? "bg-amber-50/50 border-amber-200 ring-1 ring-amber-100 shadow-sm"
                            : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm"
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
                              className="h-7 w-7 text-gray-400 hover:text-blue-600"
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
                              className="h-7 w-7 text-gray-400 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingCommentId(comment.id);
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
                          <div className="mt-3 pt-2 border-t border-gray-50">
                            <Link
                              to={comment.fileUrl || ""}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <span>View attachment</span>
                              <svg
                                className="w-2.5 h-2.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </Link>
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
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CommentsDialog;
