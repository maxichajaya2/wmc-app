"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  ScrollArea
} from "@/components"
import { formatDate } from "@/utils/format-date"
import { LoaderCircle, Pencil, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useCommentPapers } from "./useCommentPapers"
import { usePaperStore } from "../../store/papers.store"

function CommentsDialog() {
  const {
    isOpenCommentsDialog,
    closeCommentsDialog,
    handleSubmit,
    onSubmit,
    register,
    handleFileUpload,
    uploading,
    watch,
    loading,
    editingCommentId,
    errors,
    comments,
    handleEdit,
  } = useCommentPapers()
  const setDeletingCommentId = usePaperStore(
    (state) => state.openConfirmDeleteComment
  );

  return (
    <>
      <Dialog open={isOpenCommentsDialog} onOpenChange={closeCommentsDialog}>
        <DialogContent className="sm:max-w-[500px]"
          onPointerDownOutside={e => {
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2 items-start space-x-2 rounded-md border p-4">
                <Input {...register("comentary")} placeholder="Write a comment…" className="flex-grow" />
                <Input
                  type="file"
                  onChange={(e) => handleFileUpload(e)}
                  disabled={uploading}
                  className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none py-0 mx-0 px-0 file:px-4"
                />
                {uploading && (
                  <div className="flex items-center space-x-2">
                    <LoaderCircle size={24} className="animate-spin text-blue-500" />
                    <span className="text-blue-500">Subiendo...</span>
                  </div>
                )}
                {watch('fileUrl') && (
                  // Visor de archivo
                  <div className="flex items-center space-x-2">
                    <Link to={watch('fileUrl') || ''} target="_blank" className="text-blue-500 underline">
                      View uploaded file
                    </Link>
                  </div>
                )}
                <Button type="submit" disabled={loading}  className="h-8 gap-1 bg-gradient-to-br from-[#00b3dc] via-[#0124e0] to-[#00023f]">
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : editingCommentId ? (
                    "Update"
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
              {errors.comentary && <p className="text-sm text-red-500 mt-1">{errors.comentary.message}</p>}
            </form>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {comments.map((comment) => (
                <div key={comment.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {comment.user?.name}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                      {comment.fileUrl && (
                        // Visor de archivo
                        <div className="flex items-center space-x-2">
                          <Link to={comment.fileUrl || ''} target="_blank" className="text-blue-500 underline">
                            View file
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" type="button" size="sm" onClick={() => handleEdit(comment)} disabled={loading}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => setDeletingCommentId(comment.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2">{comment.comentary}</p>
                </div>
              ))}
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button type="button" onClick={closeCommentsDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CommentsDialog

