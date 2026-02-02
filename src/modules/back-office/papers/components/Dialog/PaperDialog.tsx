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
  ProcessPaper,
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
import { useUserWebStore } from "@/modules/back-office/users-web/store/users-web.store";
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
  const ratingPaper = usePaperStore((state) => state.ratingPaper);
  const topics = useTopicStore((state) => state.data);
  const categories = useCategoryStore((state) => state.data);
  const webUsers = useUserWebStore((state) => state.data);

  const title = useMemo(() => {
    switch (action) {
      case "view":
        // return "Ver Trabajo Técnico";
        return "View Technical Paper";
      case "edit":
        // return "Editar Trabajo Técnico";
        return "Edit Technical Paper";
      case "delete":
        // return "Eliminar Trabajo Técnico";
        return "Delete Technical Paper";
      case "create":
        // return 'Crear Trabajo Técnico'
        return "Create Technical Paper";
      case "receive-paper":
        // return "Cambiar estado a: RECIBIDO";
        return "Change status to: RECEIVED";
      case "send-paper":
        // return "Cambiar estado a: ENVIADO";
        return "Change status to: SENT";
      case "assign-paper":
        // return "Cambiar estado a: ASIGNADO";
        return "Change status to: ASSIGNED";
      case "review-paper":
        // return "Cambiar estado a: EN REVISIÓN";
        return "Change status to: UNDER REVIEW";
      case "rate-paper":
        // return "Puntuación";
        return "Score";
      case "approve-paper":
        // return `Cambiar estado a: ${
        //   selected?.process === ProcessPaper.PRESELECCIONADO
        //     ? "PRESELECCIONADO"
        //     : "SELECCIONADO"
        // }`;
        return `Change status to: ${
          selected?.process === ProcessPaper.PRESELECCIONADO
            ? "PRESELECTED"
            : "SELECTED"
        }`;
      case "dismiss-paper":
        // return "Cambiar estado a: DESESTIMADO";
        return "Change status to: DISMISSED";
      default:
        // return "Trabajo Técnico";
        return "Technical Paper";
    }
  }, [selected, action]);

  const form = useForm<PaperFormData>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      title: "",
      resume: "",
      file: "",
      categoryId: undefined,
      topicId: undefined,
      webUserId: undefined,
      flagEvent: false,
      eventDate: "",
      eventWhere: "",
      eventWhich: "",
      keywords: [],
      industry: "",
      agreeTerms: false,
      copyrightForm: "",
      // language: '',
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

  /* START LOGIC RATE PAPER */
  const [rating, setRating] = useState({
    score1:
      (selected?.process === ProcessPaper.PRESELECCIONADO
        ? selected.phase1Score1
        : selected?.phase2Score1) || 0,
    score2:
      (selected?.process === ProcessPaper.PRESELECCIONADO
        ? selected.phase1Score2
        : selected?.phase2Score2) || 0,
    score3:
      (selected?.process === ProcessPaper.PRESELECCIONADO
        ? selected.phase1Score3
        : selected?.phase2Score3) || 0,
  });
  const [errorRating, setErrorRating] = useState("");
  const handleInputRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrorRating("");
    // si el value es mayor a 10, se retorna un mensaje de error y se cambia el valor a 10
    if (Number(value) > 10) {
      setRating((prev) => ({
        ...prev,
        [name]: 0,
      }));
      // setErrorRating("La puntuación no puede ser mayor a 10");
      setErrorRating("The score cannot be greater than 10");
      return;
    }
    setRating((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmitRating = async () => {
    // si no hay al menos una puntuación, no se puede enviar
    if (rating.score1 === 0 && rating.score2 === 0 && rating.score3 === 0) {
      return;
    }
    if (selected) {
      await ratingPaper(rating);
    }
  };
  /* END   LOGIC RATE PAPER */

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
    // { id: TypePaper.ORAL, name: MapTypePaper[TypePaper.ORAL] },
    // { id: TypePaper.POSTER, name: MapTypePaper[TypePaper.POSTER] },
    // {
    //   id: TypePaper.PRESENTACION_INTERACTIVA,
    //   name: MapTypePaper[TypePaper.PRESENTACION_INTERACTIVA],
    // },
    {
      id: TypePaper.PRESENTACION_ORAL,
      name: MapTypePaper[TypePaper.PRESENTACION_ORAL],
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
        // toast({
        //   title: "Error",
        //   description: "Solo se permiten archivos .doc y .docx",
        //   variant: "destructive",
        // });
        toast({
          title: "Error",
          description: "Only .doc and .docx files are allowed",
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
        // console.error("Error al subir el archivo:", error);
        console.error("Error uploading the file:", error);
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    }
  };
  /* END LOGIC FILE UPLOAD */

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
          industry: selected.industry ?? "",
        });
        try {
          const authors = await PaperService.findAuthorsByPaper(selected.id);
          // Ordenar por type, primero A y despues los C

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
    if (action === "delete") return;
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid grid-cols-1 gap-0 md:gap-8 space-y-6 min-h-52"
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
                  Are you sure you want to delete {selected?.title}?
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
                  name="webUserId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>User Web</FormLabel>
                      <FormControl>
                        <Select
                          disabled={action === "view" || action === "edit"}
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={"Escoge un usuario de la web"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {webUsers.map((webUser) => (
                              <SelectItem
                                key={webUser.id}
                                value={webUser.id.toString()}
                              >
                                {webUser.name} {webUser.lastName}
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
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly={action === "view"}
                          type="text"
                          placeholder="Title"
                          className="w-full"
                          disabled={action === "view"}
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
                          Attach Paper <span className="text-red-500">*</span>
                        </p>
                        <span className="text-xs text-gray-500 mt-1">
                          If you encounter any issues uploading your paper,
                          please contact us at wmc2026@iimp.org.pe for
                          assistance.
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          (Only Word files are allowed (.doc and .docx))
                        </span>
                        <span className="text-xs text-blue-500">
                          The maximum file size is 10 MB.
                        </span>
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
                          <span className="text-blue-500">Uploading...</span>
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
                            View file
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
                            View complete paper (PHASE 2)
                          </Link>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="mt-2">
                  <FormLabel className="flex flex-col">
                    <p>
                      Copyright Transfer Form
                      <span className="text-red-500">*</span>
                    </p>
                    <span className="text-xs text-gray-500 mt-1">
                      (Only Word files are allowed (.pdf))
                    </span>
                    <span className="text-xs text-blue-500">
                      The maximum file size is 10 MB.
                    </span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      disabled={uploading || action === "view"}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await CommonService.uploadFile(file);
                          form.setValue("copyrightForm", url); // 👈 Nuevo campo
                        }
                        e.target.value = "";
                      }}
                      className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 
                      file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm 
                      file:font-semibold file:bg-blue-50 file:text-blue-700 
                      hover:file:bg-blue-100 border-none py-0"
                    />
                  </FormControl>

                  <div className="mt-2 text-xs">
                    <a
                      href="https://papers.wmc2026.org/formatos/instructivo-wmc-2026-2.pdf"
                      target="_blank"
                      className="text-blue-600 underline font-medium"
                    >
                      Download Format (Copyright Transfer Form)
                    </a>
                  </div>
                  {form.watch("copyrightForm") && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Link
                        to={form.watch("copyrightForm") || ""}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        View Uploaded Copyright Form
                      </Link>
                    </div>
                  )}
                </FormItem>
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
                              <SelectValue
                                placeholder={"Escoge una categoría"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
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
                  disabled={
                    form.watch("categoryId") === undefined && action === "view"
                  }
                  render={({ field }) => (
                    <FormItem className="">
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
                              <SelectValue placeholder={"Escoge un tema"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listTopics.map((topic) => (
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
                  name="industry"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>
                        Industry Type<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={action === "view"}
                          onValueChange={field.onChange}
                          value={field.value ?? ""} // 👈 en lugar de defaultValue
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={"Select Industry type"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Mining Company">
                              Mining Company
                            </SelectItem>
                            <SelectItem value="Exploration Company">
                              Exploration Company
                            </SelectItem>
                            <SelectItem value="Engineering / Consulting Company">
                              Engineering / Consulting Company
                            </SelectItem>
                            <SelectItem value="Construction / Infrastructure Company">
                              Construction / Infrastructure Company
                            </SelectItem>
                            <SelectItem value="Equipment / Technology Supplier">
                              Equipment / Technology Supplier
                            </SelectItem>
                            <SelectItem value="Government">
                              Government
                            </SelectItem>
                            <SelectItem value="NGO">NGO</SelectItem>
                            <SelectItem value="Academia / Research Institution">
                              Academy / Research Institution
                            </SelectItem>
                            <SelectItem value="Financial Institution / Investor">
                              Financial Institution / Investor
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                                    name="language"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Idioma</FormLabel>
                                            <FormControl>
                                                <Select
                                                    disabled={action === 'view'}
                                                    onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={'Escoge un idioma'} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        
                                                        <SelectItem value="Español">Español</SelectItem>
                                                        <SelectItem value="Inglés">Inglés</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
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
                          placeholder="Palabras clave"
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
                          <FormLabel>{"Where??"}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly={action === "view"}
                              type="text"
                              placeholder="Where?"
                              className="w-full"
                              disabled={action === "view"}
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
                              disabled={action === "view"}
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
                              disabled={action === "view"}
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
                            disabled={action === "view"}
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
                {selected?.phase1Score && (
                  <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-bold">Score: PHASE 1</h1>
                    <div className="flex gap-3">
                      <div>
                        <Label className="text-sm">Impact</Label>
                        <Input
                          name="score1"
                          readOnly
                          value={selected.phase1Score1}
                          type="number"
                          placeholder="Impact"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Quality</Label>
                        <Input
                          name="score2"
                          readOnly
                          value={selected.phase1Score2}
                          type="number"
                          placeholder="Quality"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Innovation</Label>
                        <Input
                          name="score3"
                          readOnly
                          value={selected.phase1Score3}
                          type="number"
                          placeholder="Innovation"
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-row gap-3 w-full">
                        <Separator orientation="vertical" />
                        <div className="w-full">
                          <Label className="text-sm">Final Score</Label>
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
                {selected?.phase2Score && (
                  <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-bold">Score: PHASE 2</h1>
                    <div className="flex gap-3">
                      <div className="w-full">
                        <Label className="text-sm">Impact</Label>
                        <Input
                          name="score1"
                          readOnly
                          value={selected?.phase2Score1}
                          type="number"
                          placeholder="Impact"
                          className="w-full"
                        />
                      </div>
                      <div className="w-full">
                        <Label className="text-sm">Quality</Label>
                        <Input
                          name="score2"
                          readOnly
                          value={selected?.phase2Score2}
                          type="number"
                          placeholder="Quality"
                          className="w-full"
                        />
                      </div>
                      <div className="w-full">
                        <Label className="text-sm">Innovation</Label>
                        <Input
                          name="score3"
                          readOnly
                          value={selected?.phase2Score3}
                          type="number"
                          placeholder="Innovation"
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-row gap-3 w-full">
                        <Separator orientation="vertical" />
                        <div className="w-full">
                          <Label className="text-sm">Final Score</Label>
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
                <h1 className="text-xl font-bold">Authors</h1>
                {fields.map((field, index) => (
                  <AuthorForm
                    key={field.id}
                    form={form}
                    index={index}
                    onRemove={() => remove(index)}
                  />
                ))}
                <div className="flex flex-col gap-4">
                  {form.getValues("authors").length < 3 && (
                    <Button
                      disabled={loading || action === "view"}
                      type="button"
                      className="bg-gradient-to-br from-[#00b3dc] via-[#0124e0] to-[#00023f] text-white"
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
                  {/* <Button type="submit">Save</Button> */}
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
                          : "Assign a leader"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search leader..." />
                        <CommandList>
                          <CommandEmpty>Leader not found.</CommandEmpty>
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
                          : "Assign a reviewer"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search reviewer..." />
                        <CommandList>
                          <CommandEmpty>Reviewer not found.</CommandEmpty>
                          <CommandGroup>
                            {[...reviewers, ...leaders].map((reviewer) => (
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
                {selected?.process === ProcessPaper.SELECCIONADO &&
                  action === "approve-paper" && (
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
                            : "Assign a paper type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Assign a paper type" />
                          <CommandList>
                            <CommandEmpty>Type not found.</CommandEmpty>
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
                    (selected?.process === ProcessPaper.SELECCIONADO &&
                      action === "approve-paper" &&
                      !selectedTypePaper)
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
                    "Change status"
                  )}
                </Button>
              </div>
            )}

            {action === "rate-paper" && (
              /* Tres inputs para insertar 3 scores */
              // ROW DIV FOR SCORES -> USE STATE RATING
              <div>
                <div className="flex gap-3">
                  <div className="w-full">
                    <Label className="text-sm">Impact</Label>
                    <Input
                      name="score1"
                      onChange={handleInputRate}
                      type="number"
                      placeholder="Impact"
                      className="w-full"
                      value={rating.score1}
                    />
                  </div>
                  <div className="w-full">
                    <Label className="text-sm">Quality</Label>
                    <Input
                      name="score2"
                      onChange={handleInputRate}
                      type="number"
                      placeholder="Quality"
                      className="w-full"
                      value={rating.score2}
                    />
                  </div>
                  <div className="w-full">
                    <Label className="text-sm">Innovation</Label>
                    <Input
                      name="score3"
                      onChange={handleInputRate}
                      type="number"
                      placeholder="Innovation"
                      className="w-full"
                      value={rating.score3}
                    />
                  </div>
                </div>
                {errorRating && (
                  <p className="text-red-500 text-sm mt-2">{errorRating}</p>
                )}
                {!errorRating && (
                  <Button
                    disabled={
                      loading ||
                      rating.score1 === undefined ||
                      rating.score2 === undefined ||
                      rating.score3 === undefined ||
                      rating.score1 <= 0 ||
                      rating.score2 <= 0 ||
                      rating.score3 <= 0 ||
                      rating.score1 > 10 ||
                      rating.score2 > 10 ||
                      rating.score3 > 10
                    }
                    type="button"
                    onClick={handleSubmitRating}
                    className="font-bold py-2 px-4 rounded duration-300 text-white mt-2"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoaderCircle
                          size={24}
                          className="animate-spin text-white"
                        />
                      </div>
                    ) : (
                      `Rate: ${Number(
                        (
                          (Number(rating.score1) +
                            Number(rating.score2) +
                            Number(rating.score3)) /
                          3
                        ).toFixed(2)
                      )}`
                    )}
                  </Button>
                )}
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
                    "Save Changes"
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
