import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components";
import { useCommentPapers } from "./useCommentPapers";

function ConfirmDeleteComment() {
  const {
    handleDelete,
    isOpenConfirmDeleteComment,
    closeConfirmDeleteComment,
  } = useCommentPapers();

  return (
    <AlertDialog
      open={isOpenConfirmDeleteComment}
      onOpenChange={closeConfirmDeleteComment}
    >
      <AlertDialogContent
        onPointerDown={(e) => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de que quieres eliminar este comentario?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
          <AlertDialogAction type="button" onClick={handleDelete}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDeleteComment;
