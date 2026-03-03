import { useCallback, useEffect, useState } from "react";
import { usePaperStore } from "../../store/papers.store";
import { useSessionBoundStore } from "@/modules/back-office/auth/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Commentary } from "@/models";
import { PaperService } from "../../services/papers.service";
import { CommonService } from "@/shared/services";

const commentSchema = z.object({
  comentary: z.string().min(1, "El comentario no puede estar vacío"),
  fileUrl: z.string().optional(),
  blockId: z.number().optional(),
  documentVersion: z.string().optional(),
});

type CommentFormData = z.infer<typeof commentSchema>;

export const useCommentPapers = () => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const loading = usePaperStore((state) => state.loading);
  const setLoading = usePaperStore((state) => state.setLoading);
  const comments = usePaperStore((state) => state.comments);
  const setComments = usePaperStore((state) => state.setComments);
  const selected = usePaperStore((state) => state.selected);
  const isOpenCommentsDialog = usePaperStore(
    (state) => state.isOpenCommentsDialog,
  );
  const closeCommentsDialog = usePaperStore(
    (state) => state.closeCommentsDialog,
  );
  const currentUser = useSessionBoundStore((state) => state.session?.user);

  const deletingCommentId = usePaperStore((state) => state.deletingCommentId);
  const setDeletingCommentId = usePaperStore(
    (state) => state.setDeletingCommentId,
  );
  const {
    openConfirmDeleteComment,
    closeConfirmDeleteComment,
    isOpenConfirmDeleteComment,
  } = usePaperStore((state) => ({
    isOpenConfirmDeleteComment: state.isOpenConfirmDeleteComment,
    openConfirmDeleteComment: state.openConfirmDeleteComment,
    closeConfirmDeleteComment: state.closeConfirmDeleteComment,
  }));

  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comentary: "",
      fileUrl: "",
      blockId: selectedBlockId || undefined,
      documentVersion: "Actual",
    },
  });

  useEffect(() => {
    setValue("blockId", selectedBlockId || undefined);
  }, [selectedBlockId, setValue]);

  const fetchComments = useCallback(async () => {
    if (!selected) return;
    try {
      setLoading(true);
      const data = await PaperService.findAllComments(selected.id);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [selected, setLoading, setComments]);

  useEffect(() => {
    if (selected && isOpenCommentsDialog) {
      fetchComments();
    }
  }, [selected, isOpenCommentsDialog, fetchComments]);

  /* START LOGIC FILE UPLOAD */
  const [uploading, setUploading] = useState(false);
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const fileUrl = await CommonService.uploadFile(file);
        setValue("fileUrl", fileUrl);
      } catch (error) {
        console.error("Error al subir el archivo:", error);
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    }
  };
  /* END LOGIC FILE UPLOAD */

  // const onSubmit = async (data: CommentFormData) => {
  //   if (!selected || !currentUser) return;
  //   setLoading(true);
  //   try {
  //     if (editingCommentId) {
  //       const updatedComment = await PaperService.updateComment(
  //         selected.id,
  //         editingCommentId,
  //         {
  //           comentary: data.comentary,
  //           fileUrl: data.fileUrl || undefined,
  //           blockId: data.blockId,
            
            
  //         },
  //       );
  //       setComments(
  //         comments.map((comment) =>
  //           comment.id === updatedComment.id ? updatedComment : comment,
  //         ),
  //       );
  //       setEditingCommentId(null);
  //     } else {
  //       const newComment = await PaperService.createComment(selected.id, {
  //         comentary: data.comentary,
  //         fileUrl: data.fileUrl || undefined,
  //         blockId: data.blockId,
  //       });
  //       setComments([...comments, newComment]);
  //     }
  //     reset({
  //       comentary: "",
  //       fileUrl: "",
  //       blockId: undefined,
  //     });
  //     setSelectedBlockId(null); // Clear selected block after submission
  //   } catch (error) {
  //     console.error("Error creating/updating comment:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (data: CommentFormData & { documentVersion?: string }) => {
    if (!selected || !currentUser) return;
    setLoading(true);
    try {
      // 1. Creamos el objeto que vamos a enviar (el payload)
      const payload = {
        comentary: data.comentary,
        fileUrl: data.fileUrl || undefined,
        blockId: data.blockId,
        documentVersion: String(data.documentVersion || "Actual"), // <-- ESTO ARREGLA EL ERROR 400
      };

      if (editingCommentId) {
        // 2. Para actualizar el comentario
        const updatedComment = await PaperService.updateComment(
          selected.id,
          editingCommentId,
          payload // Enviamos el payload con la versión
        );
        setComments(
          comments.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment,
          ),
        );
        setEditingCommentId(null);
      } else {
        // 3. Para crear un nuevo comentario
        const newComment = await PaperService.createComment(
          selected.id, 
          payload // Enviamos el payload con la versión
        );
        setComments([...comments, newComment]);
      }

      // 4. Limpiamos el formulario
      reset({
        comentary: "",
        fileUrl: "",
        blockId: undefined,
        // @ts-ignore (por si el tipo de reset no reconoce el campo aún)
        documentVersion: "Actual", 
      });
      setSelectedBlockId(null); 
    } catch (error) {
      console.error("Error creating/updating comment:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (comment: Commentary) => {
    reset({
      comentary: comment.comentary,
      fileUrl: comment.fileUrl || "",
      blockId: comment.blockId || undefined,
    });
    setEditingCommentId(comment.id);
    setSelectedBlockId(comment.blockId || null);
  };

  const handleDelete = async () => {
    if (!selected || !deletingCommentId) return;
    setLoading(true);
    try {
      await PaperService.removeComment(selected.id, deletingCommentId);
      setComments(
        comments.filter((comment) => comment.id !== deletingCommentId),
      );
      closeConfirmDeleteComment();
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setLoading(false);
    }
  };
  return {
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
    deletingCommentId,
    errors,
    comments,
    handleEdit,
    setDeletingCommentId,
    handleDelete,
    selectedBlockId,
    setSelectedBlockId,
    openConfirmDeleteComment,
    isOpenConfirmDeleteComment,
    closeConfirmDeleteComment,
  };
};
