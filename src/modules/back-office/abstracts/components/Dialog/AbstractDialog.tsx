import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components";
import { TypographyH4 } from "@/shared/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useAbstractStore } from "../../store/abstract.store";
import { DialogDescription } from "@radix-ui/react-dialog";
import axios from "axios";

// Esquema de validación (El "Portero")
const FormSchema = z.object({
  codigo: z.string().min(3, { message: "El código es obligatorio" }),
  name: z.string().min(3, { message: "El nombre es obligatorio" }),
  lastname: z.string().min(3, { message: "El apellido es obligatorio" }),
  email: z.string().email({ message: "Correo electrónico inválido" }),
  title: z.string().min(3, { message: "El título es obligatorio" }),
});

function AbstractDialog() {
  const action = useAbstractStore((state) => state.action);
  const selected = useAbstractStore((state) => state.selected);
  const selectedReviewer = useAbstractStore((state) => state.selectedReviewer);
  const loading = useAbstractStore((state) => state.loading);
  const isOpenDialog = useAbstractStore((state) => state.isOpenDialog);
  const closeActionModal = useAbstractStore((state) => state.closeActionModal);
  const create = useAbstractStore((state) => state.create);
  const update = useAbstractStore((state) => state.update);
  const remove = useAbstractStore((state) => state.remove);

  const title = () => {
    switch (action) {
      case "edit": return "Editar Abstract";
      case "delete": return "Eliminar Abstract";
      case "create": return "Crear Abstract";
      case "delete-reviewer": return "Eliminar Revisor";
      default: return "Abstract";
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      codigo: "",
      name: "",
      lastname: "",
      email: "",
      title: "",
    },
  });

  useEffect(() => {
    if (selected) {
      form.reset({ ...selected });
    }
  }, [selected]);

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpenDialog) {
        form.reset();
    }
  }, [isOpenDialog, form]);


  // 1. FUNCIÓN SOLO PARA GUARDAR (CREAR / EDITAR)
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (action === "create") await create(data);
      if (action === "edit") await update(data);
    } catch (error: unknown) {
      let msg = "Error inesperado";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message ?? msg;
      }
      // Mapeo de errores
      if (msg.toLowerCase().includes("código")) form.setError("codigo", { message: msg });
      if (msg.toLowerCase().includes("correo")) form.setError("email", { message: msg });
      if (msg.toLowerCase().includes("título")) form.setError("title", { message: msg });
    }
  }

  // 2. NUEVA FUNCIÓN DIRECTA PARA ELIMINAR (Sin pasar por el "Portero")
  const handleDelete = async () => {
    try {
        await remove();
        // El store debería encargarse de cerrar, pero por seguridad:
        closeActionModal();
    } catch (error) {
        console.error("Error al eliminar", error);
    }
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={(open) => !open && closeActionModal()}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title()}</DialogTitle>
        </DialogHeader>
        <DialogDescription />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid grid-cols-1 gap-0 md:gap-8 space-y-6"
          >
            {/* Mensaje de confirmación para ELIMINAR */}
            {(action === "delete" || action === "delete-reviewer") && (
              <div>
                <TypographyH4>
                  ¿Estás seguro de eliminar a {action === "delete-reviewer" ? selectedReviewer?.name : selected?.name}?
                </TypographyH4>
              </div>
            )}

            {/* Inputs para CREAR / EDITAR */}
            {(action === "create" || action === "edit") && (
              <div className="space-y-6">
                <FormField
                  name="codigo"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl><Input {...field} placeholder="A-001" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl><Input {...field} placeholder="Nombre" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="lastname"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl><Input {...field} placeholder="Apellidos" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="correo@ejemplo.com" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl><Input {...field} placeholder="Título del abstract" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* BOTONES */}
            <DialogFooter className="col-span-1 md:col-span-2 ml-auto flex flex-row gap-2">
              
              {/* 3. LÓGICA IMPORTANTE: Si es eliminar, usas un botón simple. Si es guardar, usas submit. */}
              
              {action.includes("delete") ? (
                <Button
                  type="button" // <--- ESTO ES LA CLAVE (Evita la validación)
                  onClick={handleDelete}
                  disabled={loading}
                  className="font-bold py-2 px-4 rounded duration-300 text-white bg-red-600 hover:bg-red-700"
                >
                  {loading ? <LoaderCircle size={24} className="animate-spin text-white" /> : "Eliminar"}
                </Button>
              ) : (
                <Button
                  type="submit" // <--- Este sí valida el formulario
                  disabled={loading}
                  className="font-bold py-2 px-4 rounded duration-300 text-white"
                >
                  {loading ? <LoaderCircle size={24} className="animate-spin text-white" /> : "Guardar"}
                </Button>
              )}

              <Button
                type="button"
                disabled={loading}
                onClick={closeActionModal}
                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AbstractDialog;