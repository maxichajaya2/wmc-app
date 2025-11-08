import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  toast,
  Textarea,
} from "@/components";
import { TypographyH4 } from "@/shared/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import Creatable from "react-select/creatable";
import { useEffect, useMemo, useState } from "react";
import { usePaperStore } from "../../store/papers.store";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  AuthorType,
  MapTypePaper,
  PrimaryRoles,
  StatePaper,
  TypePaper,
  User,
} from "@/models";
import { CommonService } from "@/shared/services";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTopicStore } from "@/modules/back-office/topics/store/topic.store";
import { AuthorForm } from "./AuthorForm";
import { AuthorFormData, PaperFormData, paperSchema } from "./schemas";
import { PaperService } from "../../services/papers.service";
import { useUsersStore } from "@/modules/back-office/users/store/users.store";
import { useCategoryStore } from "@/modules/back-office/category/store/category.store";
import { useAuthIntranetStore } from "@/modules/intranet/auth/store";
import { Loader } from "@/shared";
import { DateClass } from "@/lib";

function PapersDialog() {
  const action = usePaperStore((state) => state.action);
  const selected = usePaperStore((state) => state.selected);
  const loading = usePaperStore((state) => state.loading);
  const isOpenDialog = usePaperStore((state) => state.isOpenDialog);
  const closeActionModal = usePaperStore((state) => state.closeActionModal);
  const create = usePaperStore((state) => state.create);
  const update = usePaperStore((state) => state.update);
  const deletePaper = usePaperStore((state) => state.remove);
  const uploadCompleteArchive = usePaperStore(
    (state) => state.uploadCompleteArchive
  );
  const topics = useTopicStore((state) => state.data);
  const categories = useCategoryStore((state) => state.data);

  const title = () => {
    switch (action) {
      case "view":
        return "Ver Trabajo Técnico";
      case "edit":
        return "Editar Trabajo Técnico";
      case "delete":
        return "Eliminar Trabajo Técnico";
      case "create":
        // return 'Crear Trabajo Técnico'
        return "Create Technical Paper";
      case "receive-paper":
        // return "Enviar Trabajo Técnico";
        return "Submit Technical Paper";
      case "send-paper":
        return "Cambiar estado a: ENVIADO";
      case "assign-paper":
        return "Cambiar estado a: ASIGNADO";
      case "review-paper":
        return "Cambiar estado a: EN REVISIÓN";
      case "approve-paper":
        return "Cambiar estado a: APROBADO";
      case "dismiss-paper":
        return "Cambiar estado a: DESESTIMADO";
      case "charge-complete-archive":
        return "Cargar trabajo completo";
      default:
        return "Trabajo Técnico";
    }
  };

  const userWeb = useAuthIntranetStore((state) => state.user);

  if (!userWeb) return <Loader />;

  const form = useForm<PaperFormData>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      title: "",
      resume: "",

      file: "",
      categoryId: undefined,
      topicId: undefined,
      webUserId: userWeb?.id,
      flagEvent: false,
      eventDate: "",
      eventWhere: "",
      eventWhich: "",
      keywords: [],
      language: "",
      authorBiography: "",
      abstractText: "",
      proposalSignificance: "",
      agreeTerms: false,
      authors: [
        {
          type: AuthorType.AUTOR,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "authors",
  });

  /* START LOGIC CHANGE STATUS */
  const changeStatusPaper = usePaperStore((state) => state.changeStatusPaper);
  const users = useUsersStore((state) => state.data);

  const leadersUsers = users.filter(
    (user) => user.role.id === PrimaryRoles.LEADER
  );
  const reviewersUsers = users.filter(
    (user) => user.role.id === PrimaryRoles.REVIEWER
  );
  const leaders = useMemo(() => {
    if (!selected) {
      return [];
    }
    return leadersUsers.filter(
      (user) => user.categoryId === selected.categoryId
    );
  }, [selected, leadersUsers]);
  const reviewers = useMemo(() => {
    if (!selected) {
      return [];
    }
    return reviewersUsers.filter(
      (user) => user.categoryId === selected.categoryId
    );
  }, [selected, reviewersUsers]);
  const [selectedLeader, setSelectedLeader] = useState<User | null>(null);
  const [selectedReviewer, setSelectedReviewer] = useState<User | null>(null);

  const paperTypes = [
    { id: TypePaper.ORAL, name: MapTypePaper[TypePaper.ORAL] },
    { id: TypePaper.POSTER, name: MapTypePaper[TypePaper.POSTER] },
    {
      id: TypePaper.PRESENTACION_INTERACTIVA,
      name: MapTypePaper[TypePaper.PRESENTACION_INTERACTIVA],
    },
  ];
  const [selectedTypePaper, setSelectedTypePaper] = useState<TypePaper | null>(
    null
  );
  const handleChangeStatus = () => {
    let status: StatePaper = StatePaper.RECEIVED;
    switch (action) {
      case "receive-paper":
        status = StatePaper.RECEIVED;
        break;
      case "send-paper":
        status = StatePaper.SENT;
        break;
      case "assign-paper":
        status = StatePaper.ASSIGNED;
        break;
      case "review-paper":
        status = StatePaper.UNDER_REVIEW;
        break;
      case "approve-paper":
        status = StatePaper.APPROVED;
        break;
      case "dismiss-paper":
        status = StatePaper.DISMISSED;
        break;
    }
    if (selected) {
      changeStatusPaper({
        state: status,
        leaderId:
          status === StatePaper.SENT && selectedLeader
            ? selectedLeader.id
            : undefined,
        reviewerUserId:
          status === StatePaper.ASSIGNED && selectedReviewer
            ? selectedReviewer.id
            : undefined,
        type:
          status === StatePaper.APPROVED && selectedTypePaper
            ? selectedTypePaper
            : undefined,
      });
    }
  };
  /* END   LOGIC CHANGE STATUS */

  /* START LOGIC FILE UPLOAD */
  const [uploading, setUploading] = useState(false);
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = event.target.files?.[0];
    const allowedExtensions = ["doc", "docx"];
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      setUploading(true);
      if (!allowedExtensions.includes(extension!)) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos .doc y .docx",
          variant: "destructive",
        });
        event.target.value = ""; // Limpia el input
        setUploading(false);
        return;
      }
      try {
        const fileUrl = await CommonService.uploadFile(file);

        if (index !== undefined) {
          // Reemplazar el file existente
          form.setValue("file", fileUrl);
        } else {
          // Agregar una nueva imagen
          form.setValue("file", fileUrl);
        }
      } catch (error) {
        console.error("Error al subir el archivo:", error);
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    }
  };
  /* END LOGIC FILE UPLOAD */

  /* START LOGIC FILE UPLOAD COMPLETE ARCHIVE */
  const [uploadingCompleteArchive, setUploadingCompleteArchive] =
    useState(false);
  const [fullFileUrl, setCompleteArchive] = useState<string | null>(null);
  const handleFileUploadCompleteArchive = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingCompleteArchive(true);
      try {
        const fileUrl = await CommonService.uploadFile(file);

        setCompleteArchive(fileUrl);
      } catch (error) {
        console.error("Error al subir el archivo:", error);
      } finally {
        setUploadingCompleteArchive(false);
        event.target.value = "";
      }
    }
  };

  const handleSendCompleteArchive = async () => {
    if (fullFileUrl && selected) {
      uploadCompleteArchive(fullFileUrl);
    }
  };
  /* END LOGIC FILE UPLOAD COMPLETE ARCHIVE */
  // LOGIC AUTHORS
  useEffect(() => {
    (async () => {
      if (selected) {
        form.reset({
          ...selected,
          file: selected.file ?? "",
          categoryId: selected.categoryId ?? undefined,
          topicId: selected.topicId ?? undefined,
          webUserId: selected.webUserId ?? undefined,
          eventDate: selected.eventDate
            ? DateClass.DateToFormat(
                selected.eventDate,
                DateClass.FORMAT_INPUT_SHORT
              )
            : undefined,
          eventWhere: selected.eventWhere ?? "",
          eventWhich: selected.eventWhich ?? "",
          flagEvent: selected.flagEvent ?? false,
          keywords: selected.keywords ?? [],
        });
        try {
          const authors = await PaperService.findAuthorsByPaper(selected.id);
          authors.sort((a, b) => {
            if (a.type === AuthorType.AUTOR && b.type !== AuthorType.AUTOR)
              return -1;
            if (a.type !== AuthorType.AUTOR && b.type === AuthorType.AUTOR)
              return 1;
            return 0;
          });
          form.reset({
            ...form.watch(),
            authors: authors,
          });
        } catch (error) {
          form.reset({
            ...form.watch(),
            authors: [{}],
          });
        }
      }
    })();
  }, [selected]);
  // END LOGIC AUTHORS

  // LOGIC CATEGORIES
  const listTopics = useMemo(() => {
    if (!form.watch("categoryId")) {
      return [];
    }
    return topics.filter(
      (topic) => topic.categoryId == form.watch("categoryId")
    );
  }, [form.watch("categoryId"), topics, selected]);

  // Efecto que resetea el campo de temas cuando se cambia la categoría
  useEffect(() => {
    // if (selected) {
    //     form.setValue('topicId', selected.topicId)
    // } else {
    // }
    form.setValue("topicId", undefined as unknown as number);
  }, [form.watch("categoryId")]);
  // END LOGIC CATEGORIES

  // Reset form when dialog is closed
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, []);

  function onSubmit(data: PaperFormData) {
    if (action === "create") {
      return create(data);
    }
    if (action === "edit") {
      return update(data);
    }
  }

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={(open) => {
        if (!open) {
          closeActionModal();
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title()}</DialogTitle>
        </DialogHeader>
        {/* Aviso para Submit Technical Paper */}
        {action === "receive-paper" && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Important</p>
            <p className="mt-1">
              Once you submit, you will no longer be able to edit your abstract
              or its details. A confirmation email will be sent to your
              registered address confirming that your technical paper was
              submitted successfully.
            </p>
          </div>
        )}

        <DialogDescription />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid grid-cols-1 gap-0 md:gap-8 space-y-6 min-h-max"
          >
            <pre className="text-xs col-span-2 hidden">
              <code>
                {JSON.stringify(
                  {
                    form: form.watch(),
                    action,
                    // errors: form.formState.errors
                  },
                  null,
                  4
                )}
              </code>
            </pre>
            {action === "delete" && (
              <div>
                <TypographyH4 className="">
                  ¿Estás seguro de eliminar a {selected?.title}?
                </TypographyH4>
                <DialogFooter className="col-span-1 md:col-span-2 ml-auto flex flex-row gap-2">
                  <Button
                    disabled={loading}
                    type="button"
                    onClick={deletePaper}
                    className="font-bold py-2 px-4 rounded duration-300 text-white"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoaderCircle
                          size={24}
                          className="animate-spin text-white"
                        />
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={closeActionModal}
                    className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300"
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </div>
            )}
            {(action === "create" ||
              action === "edit" ||
              action === "view") && (
              <div className="space-y-6">
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>
                        Title of your abstract{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly={action === "view"}
                          type="text"
                          placeholder="Title"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                                    name="resume"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Resumen</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    readOnly={action === 'view'}
                                                    placeholder="Resumen"
                                                    className="w-full resize-y"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                <FormField
                  name="file"
                  control={form.control}
                  render={(_) => (
                    <FormItem className="">
                      <FormLabel className="flex flex-col">
                        <p>
                          Attach abstract <span className="text-red-500">*</span>
                        </p>
                         <span className="text-xs text-gray-500 mt-1">
                         If you encounter any issues uploading your abstract, please do not hesitate to contact us at wmc2026@iimp.org.pe for assistance.
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          (Only Word files are allowed (.doc and .docx))
                        </span>
                         <span className="text-xs text-blue-500"> El tamaño máximo es de 10 MB.</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          // aceptar solo document word
                          accept=".doc,.docx"
                          onChange={(e) => handleFileUpload(e)}
                          disabled={uploading || action === "view"}
                          className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none py-0"
                        />
                      </FormControl>
                      {uploading && (
                        <div className="flex items-center space-x-2">
                          <LoaderCircle
                            size={24}
                            className="animate-spin text-blue-500"
                          />
                          <span className="text-blue-500">Subiendo...</span>
                        </div>
                      )}
                      {form.watch("file") && (
                        // Visor de archivo
                        <div className="flex items-center space-x-2">
                          <Link
                            to={form.watch("file") || ""}
                            target="_blank"
                            className="text-blue-500 underline"
                          >
                            Ver archivo
                          </Link>
                        </div>
                      )}
                      {selected?.fullFileUrl && (
                        // Visor de archivo
                        <div className="flex items-center space-x-2">
                          <Link
                            to={selected.fullFileUrl || ""}
                            target="_blank"
                            className="text-blue-500 underline"
                          >
                            Ver trabajo completo (FASE 2)
                          </Link>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="categoryId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>
                        Category <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={action === "view"}
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={"Select a Category"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories
                              // ordenar alfabéticamente
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="topicId"
                  control={form.control}
                  disabled={form.watch("categoryId") === undefined}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        <p>
                          Topic <span className="text-red-500">*</span>
                        </p>
                        <span className="text-xs text-gray-500 mt-1">
                          (Please select the topic that best fits your paper)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={action === "view"}
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={"Select a Topic"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listTopics
                              // ordenar alfabéticamente
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((topic) => (
                                <SelectItem
                                  key={topic.id}
                                  value={topic.id.toString()}
                                >
                                  {topic.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="authorBiography"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>
                        <p>
                          Author Biography{" "}
                          <span className="text-red-500">*</span>
                        </p>
                        <span className="text-xs text-gray-500 mt-1">
                          Please share a brief bio (up to 100 words), what sets
                          you apart?
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          readOnly={action === "view"}
                          placeholder="Author Biography"
                          className="w-full resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="abstractText"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>
                        <p>
                          Abstract Submission{" "}
                          <span className="text-red-500">*</span>
                        </p>
                        <span className="text-xs text-gray-500 mt-1">
                          Please submit your abstract (400 words max, optional
                          up to 2 charts or visuals).
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          readOnly={action === "view"}
                          placeholder=" Abstract Submission"
                          className="w-full resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="proposalSignificance"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>
                        <p>
                          Proposal Significance{" "}
                          <span className="text-red-500">*</span>
                        </p>
                        <span className="text-xs text-gray-500 mt-1">
                          Why is this proposal important for the congress? (Up
                          to 100 words)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          readOnly={action === "view"}
                          placeholder="Proposal Significance"
                          className="w-full resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="language"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>
                        Language <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={action === "view"}
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={"Select a Language"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* Español, Inglés */}
                            <SelectItem value="Español">Spanish</SelectItem>
                            <SelectItem value="Inglés">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="keywords"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Creatable
                          isMulti
                          {...field}
                          isDisabled={action === "view"}
                          placeholder="Keywords"
                          className="w-full"
                          value={
                            (form.watch("keywords") as any) &&
                            form
                              .watch("keywords")
                              ?.map((tag) => ({ value: tag, label: tag }))
                          }
                          onChange={(options) => {
                            const map = options.map(
                              (option: any) => option.value
                            );
                            form.setValue("keywords", map);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="flagEvent"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-2 col-span-2">
                      <div className="space-y-0.5">
                        <FormLabel>
                          Was this paper presented at this or another event?
                        </FormLabel>
                        <FormDescription>
                          If checked, additional information will be requested.
                        </FormDescription>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Switch
                          disabled={action === "view"}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("flagEvent") && (
                  <>
                    <FormField
                      name="eventWhere"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>{"Where?"}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={action === "view"}
                              type="text"
                              placeholder="Where?"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="eventWhich"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>At which event?</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={action === "view"}
                              type="text"
                              placeholder="At which event?"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="eventDate"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>On what date?</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={action === "view"}
                              type="date"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="space-y-3 border rounded p-4">
                      <FormLabel className="text-sm leading-6">
                        <strong>
                          I hereby declare that I have the proper authority to
                          use, reproduce, present, and display the material
                          included in my submission, including but not limited
                          to images, representations, videos, photographs,
                          graphics, and texts, whether or not copyright is
                          formally registered, and that doing so does not
                          conflict with or infringe upon the intellectual
                          property rights or other rights of any other
                          individual or entity.
                        </strong>
                      </FormLabel>
                      <br />
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

                        <FormDescription className="m-0">
                          I agree
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                {/* TODO: se agrego && false porque el cliente ya no quiere mostrar estos datos */}
                {selected?.phase1Score && false && (
                  <div className="flex-col gap-2 hidden">
                    <h1 className="text-xl font-bold">Puntuación: FASE 1</h1>
                    <div className="flex gap-3">
                      <div className="w-full">
                        <Label className="text-sm">Impacto</Label>
                        <Input
                          name="score1"
                          readOnly
                          value={selected?.phase1Score1}
                          type="number"
                          placeholder="Impacto"
                          className="w-full"
                        />
                      </div>
                      <div className="w-full">
                        <Label className="text-sm">Calidad</Label>
                        <Input
                          name="score2"
                          readOnly
                          value={selected?.phase1Score2}
                          type="number"
                          placeholder="Calidad"
                          className="w-full"
                        />
                      </div>
                      <div className="w-full">
                        <Label className="text-sm">Innovación</Label>
                        <Input
                          name="score3"
                          readOnly
                          value={selected?.phase1Score3}
                          type="number"
                          placeholder="Innovación"
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-row gap-3 w-full">
                        <Separator orientation="vertical" />
                        <div className="w-full">
                          <Label className="text-sm">Puntuación Final</Label>
                          <Input
                            name="scoreFinal"
                            readOnly
                            value={selected?.phase1Score}
                            type="number"
                            placeholder="Score 3"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <Separator />
                {/* TODO: se agrego && false porque el cliente ya no quiere mostrar estos datos */}
                {selected?.phase2Score && false && (
                  <div className="flex-col gap-2 hidden">
                    <h1 className="text-xl font-bold">Puntuación: FASE 2</h1>
                    <div className="flex gap-3">
                      <div className="w-full">
                        <Label className="text-sm">Impacto</Label>
                        <Input
                          name="score1"
                          readOnly
                          value={selected?.phase2Score1}
                          type="number"
                          placeholder="Impacto"
                          className="w-full"
                        />
                      </div>
                      <div className="w-full">
                        <Label className="text-sm">Calidad</Label>
                        <Input
                          name="score2"
                          readOnly
                          value={selected?.phase2Score2}
                          type="number"
                          placeholder="Calidad"
                          className="w-full"
                        />
                      </div>
                      <div className="w-full">
                        <Label className="text-sm">Innovación</Label>
                        <Input
                          name="score3"
                          readOnly
                          value={selected?.phase2Score3}
                          type="number"
                          placeholder="Innovación"
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-row gap-3 w-full">
                        <Separator orientation="vertical" />
                        <div className="w-full">
                          <Label className="text-sm">Puntuación Final</Label>
                          <Input
                            name="scoreFinal"
                            readOnly
                            value={selected?.phase2Score}
                            type="number"
                            placeholder="Score 3"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <Separator />
                <h1 className="text-xl font-bold">Author</h1>
                {fields.map((field, index) => (
                  <AuthorForm
                    key={field.id}
                    form={form}
                    index={index}
                    onRemove={() => remove(index)}
                  />
                ))}
                <div className="flex flex-col gap-4">
                  {form.getValues("authors").length < 6 && (
                    <Button
                      disabled={loading || action === "view"}
                      type="button"
                      onClick={() =>
                        append({
                          type:
                            form.watch("authors")[0]?.type === AuthorType.AUTOR
                              ? AuthorType.COAUTOR
                              : AuthorType.AUTOR,
                        } as AuthorFormData)
                      }
                    >
                      Add Co-author
                    </Button>
                  )}
                </div>
              </div>
            )}
            {(action === "receive-paper" ||
              action === "send-paper" ||
              action === "assign-paper" ||
              action === "review-paper" ||
              action === "approve-paper" ||
              action === "dismiss-paper") && (
              <div className="flex flex-row gap-3 p-3 rounded-md mb-3">
                {action === "send-paper" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between"
                      >
                        {selectedLeader
                          ? `${selectedLeader.name}`
                          : "Asigna un líder"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar líder..." />
                        <CommandList>
                          <CommandEmpty>Líder no encontrado.</CommandEmpty>
                          <CommandGroup>
                            {leaders.map((leader) => (
                              <CommandItem
                                key={leader.id}
                                onSelect={() => {
                                  setSelectedLeader(
                                    selectedLeader?.id === leader.id
                                      ? null
                                      : leader
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedLeader?.id === leader.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {`${leader.name}`}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                {action === "assign-paper" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between"
                      >
                        {selectedReviewer
                          ? `${selectedReviewer.name}`
                          : "Asigna un revisor"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar revisor..." />
                        <CommandList>
                          <CommandEmpty>Revisor no encontrado.</CommandEmpty>
                          <CommandGroup>
                            {reviewers.map((reviewer) => (
                              <CommandItem
                                key={reviewer.id}
                                onSelect={() => {
                                  setSelectedReviewer(
                                    selectedReviewer?.id === reviewer.id
                                      ? null
                                      : reviewer
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedReviewer?.id === reviewer.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {`${reviewer.name}`}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                {action === "approve-paper" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between"
                      >
                        {selectedTypePaper
                          ? `${
                              paperTypes.find(
                                (type) => type.id === selectedTypePaper
                              )?.name
                            }`
                          : "Asigna un tipo de paper"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar tipo de paper..." />
                        <CommandList>
                          <CommandEmpty>Tipo no encontrado.</CommandEmpty>
                          <CommandGroup>
                            {paperTypes.map((typePaper) => (
                              <CommandItem
                                key={typePaper.id}
                                onSelect={() => {
                                  setSelectedTypePaper(
                                    selectedTypePaper === typePaper.id
                                      ? null
                                      : typePaper.id
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedTypePaper === typePaper.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {`${typePaper.name}`}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                <Button
                  disabled={
                    loading ||
                    (action === "assign-paper" && !selectedReviewer) ||
                    (action === "send-paper" && !selectedLeader) ||
                    (action === "approve-paper" && !selectedTypePaper)
                  }
                  type="button"
                  onClick={handleChangeStatus}
                  className="font-bold py-2 px-4 rounded duration-300 text-white"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <LoaderCircle
                        size={24}
                        className="animate-spin text-white"
                      />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            )}

            {action === "charge-complete-archive" && (
              <div className="space-y-6">
                <Input
                  type="file"
                  // aceptar solo document word
                  accept=".doc,.docx"
                  onChange={(e) => handleFileUploadCompleteArchive(e)}
                  disabled={uploading}
                  className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none py-0"
                />
                {uploadingCompleteArchive && (
                  <div className="flex items-center space-x-2">
                    <LoaderCircle
                      size={24}
                      className="animate-spin text-blue-500"
                    />
                    <span className="text-blue-500">Subiendo...</span>
                  </div>
                )}
                {fullFileUrl && (
                  // Visor de archivo
                  <div className="flex items-center space-x-2">
                    <Link
                      to={fullFileUrl || ""}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      Ver archivo
                    </Link>
                  </div>
                )}
                <Button
                  disabled={loading || !fullFileUrl}
                  type="button"
                  onClick={handleSendCompleteArchive}
                  className="font-bold py-2 px-4 rounded duration-300 text-white"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <LoaderCircle
                        size={24}
                        className="animate-spin text-white"
                      />
                    </div>
                  ) : (
                    "Enviar Archivo"
                  )}
                </Button>
              </div>
            )}

            {(action === "create" || action === "edit") && (
              <DialogFooter className="col-span-1 md:col-span-2 ml-auto flex flex-row gap-2">
                <Button
                  disabled={loading}
                  type="submit"
                  className="font-bold py-2 px-4 rounded duration-300 text-white"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <LoaderCircle
                        size={24}
                        className="animate-spin text-white"
                      />
                    </div>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  disabled={loading}
                  onClick={closeActionModal}
                  className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300"
                >
                  Cancel
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PapersDialog;
