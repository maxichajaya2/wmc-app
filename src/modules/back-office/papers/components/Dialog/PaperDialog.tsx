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
import { Check, ChevronsUpDown, LoaderCircle , FileText, ExternalLink} from "lucide-react";
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
import { useSessionBoundStore } from "@/modules/back-office/auth/store";

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
  const session = useSessionBoundStore((state) => state.session);
  const user = session?.user;

  const [mainReviewer, setMainReviewer] = useState<string>("");
  const [support1, setSupport1] = useState<string>("");
  const [support2, setSupport2] = useState<string>("");
  const [support3, setSupport3] = useState<string>("");

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
        return `Change status to: ${
          selected?.process === ProcessPaper.PRESELECCIONADO
            ? "PRESELECTED"
            : "SELECTED"
        }`;
      case "observe-paper":
        return "Change status to: OBSERVED";
      case "subsanate-paper":
        return "Change status to: SUBSANATED";
      case "dismiss-paper":
        // return "Cambiar estado a: DESESTIMADO";
        return "Change status to: DISMISSED";
      case "reassign-paper":
        return "Reassign Responsible (Reviewer)";
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
    score1: 0,
    score2: 0,
    score3: 0,
  });
  const [errorRating, setErrorRating] = useState("");

  const realTimeGeneralRate = useMemo(() => {
    if (!selected) return "0.00";
    const phasePrefix =
      selected.process === ProcessPaper.PRESELECCIONADO ? "p1" : "p2";

    const slots = [
      { id: selected.reviewerUserId, slot: "m" },
      { id: selected.reviewerSupport1Id, slot: "s1" },
      { id: selected.reviewerSupport2Id, slot: "s2" },
      { id: selected.reviewerSupport3Id, slot: "s3" },
    ];

    let totalSum = 0;
    let count = 0;

    slots.forEach((rev) => {
      if (!rev.id) return;

      let rate = 0;
      if (user?.id === rev.id && action === "rate-paper") {
        rate =
          (Number(rating.score1) +
            Number(rating.score2) +
            Number(rating.score3)) /
          3;
      } else {
        rate = Number((selected as any)[`${phasePrefix}_${rev.slot}_rate`]);
      }

      if (rate > 0) {
        totalSum += rate;
        count++;
      }
    });

    return count > 0 ? (totalSum / count).toFixed(2) : "0.00";
  }, [selected, rating, user?.id, action]);
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
  useEffect(() => {
    if (isOpenDialog && selected) {
      setMainReviewer(
        selected.reviewerUserId?.toString() ||
          selected.reviewerUser?.id?.toString() ||
          "",
      );
      setSupport1(
        selected.reviewerSupport1Id?.toString() ||
          selected.reviewerSupport1?.id?.toString() ||
          "none",
      );
      setSupport2(
        selected.reviewerSupport2Id?.toString() ||
          selected.reviewerSupport2?.id?.toString() ||
          "none",
      );
      setSupport3(
        selected.reviewerSupport3Id?.toString() ||
          selected.reviewerSupport3?.id?.toString() ||
          "none",
      );

      if (action === "rate-paper") {
        const isMain = user?.id === selected.reviewerUserId;
        const isSupport1 = user?.id === selected.reviewerSupport1Id;
        const isSupport2 = user?.id === selected.reviewerSupport2Id;
        const isSupport3 = user?.id === selected.reviewerSupport3Id;

        let s1 = 0,
          s2 = 0,
          s3 = 0;

        const phasePrefix =
          selected.process === ProcessPaper.PRESELECCIONADO ? "p1" : "p2";

        if (isMain) {
          s1 =
            Number(
              selected[`${phasePrefix}_m_impact` as keyof typeof selected],
            ) || 0;
          s2 =
            Number(
              selected[`${phasePrefix}_m_quality` as keyof typeof selected],
            ) || 0;
          s3 =
            Number(
              selected[`${phasePrefix}_m_innovation` as keyof typeof selected],
            ) || 0;
        } else if (isSupport1) {
          s1 =
            Number(
              selected[`${phasePrefix}_s1_impact` as keyof typeof selected],
            ) || 0;
          s2 =
            Number(
              selected[`${phasePrefix}_s1_quality` as keyof typeof selected],
            ) || 0;
          s3 =
            Number(
              selected[`${phasePrefix}_s1_innovation` as keyof typeof selected],
            ) || 0;
        } else if (isSupport2) {
          s1 =
            Number(
              selected[`${phasePrefix}_s2_impact` as keyof typeof selected],
            ) || 0;
          s2 =
            Number(
              selected[`${phasePrefix}_s2_quality` as keyof typeof selected],
            ) || 0;
          s3 =
            Number(
              selected[`${phasePrefix}_s2_innovation` as keyof typeof selected],
            ) || 0;
        } else if (isSupport3) {
          s1 =
            Number(
              selected[`${phasePrefix}_s3_impact` as keyof typeof selected],
            ) || 0;
          s2 =
            Number(
              selected[`${phasePrefix}_s3_quality` as keyof typeof selected],
            ) || 0;
          s3 =
            Number(
              selected[`${phasePrefix}_s3_innovation` as keyof typeof selected],
            ) || 0;
        }

        setRating({
          score1: s1,
          score2: s2,
          score3: s3,
        });
      }
    }
  }, [isOpenDialog, selected, action, user?.id]);

  /* START LOGIC CHANGE STATUS */
  const changeStatusPaper = usePaperStore((state) => state.changeStatusPaper);

  const users = useUsersStore((state) => state.data);

  const leadersUsers = users.filter(
    (user) => user.role.id === PrimaryRoles.LEADER,
  );
  const reviewersUsers = users.filter(
    (user) => user.role.id === PrimaryRoles.REVIEWER,
  );

  const categoryUsers = useMemo(() => {
    if (!selected || !selected.categoryId) {
      return [];
    }
    return users.filter(
      (user) =>
        user.isActive &&
        Number(user.categoryId) === Number(selected.categoryId),
    );
  }, [selected, users]);

  const categoryReviewers = useMemo(() => {
    return categoryUsers.filter(
      (user) => user.role.id === PrimaryRoles.REVIEWER,
    );
  }, [categoryUsers]);

  const leaders = useMemo(() => {
    if (!selected || !selected.categoryId) {
      return [];
    }
    return leadersUsers.filter(
      (user) =>
        user.isActive &&
        Number(user.categoryId) === Number(selected.categoryId),
    );
  }, [selected, leadersUsers]);
  const reviewers = useMemo(() => {
    if (!selected || !selected.categoryId) {
      return [];
    }
    return reviewersUsers.filter(
      (user) =>
        user.isActive &&
        Number(user.categoryId) === Number(selected.categoryId),
    );
  }, [selected, reviewersUsers]);

  // Log for debugging (remove in production)
  useEffect(() => {
    if (isOpenDialog && selected) {
      console.log("SCOPED DATA FOR CATEGORY:", selected.categoryId);
      console.log("LEADERS (Role 3):", leaders);
      console.log("REVIEWERS (Role 2):", reviewers);
    }
  }, [isOpenDialog, selected, leaders, reviewers]);
  const [selectedLeader, setSelectedLeader] = useState<User | null>(null);

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
    null,
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
      case "observe-paper":
        status = StatePaper.OBSERVED;
        break;
      case "reassign-paper":
        status = StatePaper.ASSIGNED;
        break;
      case "subsanate-paper":
        status = StatePaper.SUBSANATED;
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
          status === StatePaper.ASSIGNED && mainReviewer
            ? Number(mainReviewer)
            : status === StatePaper.ASSIGNED
              ? null // Force null if it's assignment but no reviewer (shouldn't happen with UI guards)
              : undefined,
        reviewerSupport1Id:
          status === StatePaper.ASSIGNED && support1 && support1 !== "none"
            ? Number(support1)
            : status === StatePaper.ASSIGNED
              ? null // Force null for "none" or empty during assignment
              : undefined,
        reviewerSupport2Id:
          status === StatePaper.ASSIGNED && support2 && support2 !== "none"
            ? Number(support2)
            : status === StatePaper.ASSIGNED
              ? null
              : undefined,
        reviewerSupport3Id:
          status === StatePaper.ASSIGNED && support3 && support3 !== "none"
            ? Number(support3)
            : status === StatePaper.ASSIGNED
              ? null
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
    index?: number,
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
                DateClass.FORMAT_INPUT_SHORT,
              )
            : undefined,
          eventWhere: selected.eventWhere ?? "",
          eventWhich: selected.eventWhich ?? "",
          flagEvent: selected.flagEvent ?? false,
          keywords: selected.keywords ?? [],
          industry: selected.industry ?? "",
          // reviewerUser: selected.reviewerUserId ?? undefined,
          // reviewerSupport1: selected.reviewerSupport1Id ?? undefined,
          // reviewerSupport2: selected.reviewerSupport2Id ?? undefined,
          // reviewerSupport3: selected.reviewerSupport3Id ?? undefined,
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
        } catch (err) {
          console.error("Error fetching authors:", err);
          form.reset({
            ...form.watch(),
            authors: [{}],
          });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, form, action]);
  // END LOGIC AUTHORS

  // LOGIC CATEGORIES
  const listTopics = useMemo(() => {
    if (!form.watch("categoryId")) {
      return [];
    }
    return topics.filter(
      (topic) => topic.categoryId == form.watch("categoryId"),
    );
  }, [form, topics]);

  // Efecto que resetea el campo de temas cuando se cambia la categoría
  useEffect(() => {
    if (action === "delete") return;
    form.setValue("topicId", undefined as unknown as number);
  }, [form, action]);
  // END LOGIC CATEGORIES

  // Reset form when dialog is closed
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [form]);

  // BUSCA ESTE BLOQUE:
  // changeStatusPaper({
  //   state: StatePaper.ASSIGNED,
  //   reviewerUserId: Number(mainReviewer),
  //   // Usa undefined en lugar de null para evitar errores de tipado
  //   reviewerSupport1Id: support1 ? Number(support1) : undefined,
  //   reviewerSupport2Id: support2 ? Number(support2) : undefined,
  //   reviewerSupport3Id: support3 ? Number(support3) : undefined,
  // });

  function onSubmit(data: PaperFormData) {
    if (action === "create") {
      return create(data);
    }
    if (action === "edit") {
      return update(data);
    }
  }

  // console.log("reviewers", reviewers);
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
                  4,
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
                  render={() => (
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
                            (
                              form.watch("keywords") as string[] | undefined
                            )?.map((tag) => ({ value: tag, label: tag })) || []
                          }
                          onChange={(
                            options: readonly {
                              value: string;
                              label: string;
                            }[],
                          ) => {
                            const map = options.map((option) => option.value);
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
                <Separator />
                {(selected?.phase1_general_rate ||
                  selected?.p1_m_rate ||
                  selected?.p1_s1_rate ||
                  selected?.p1_s2_rate ||
                  selected?.p1_s3_rate) && (
                  <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">Scores: PHASE 1</h1>

                    {[
                      {
                        key: "m",
                        label: "Main Reviewer",
                        user: selected.reviewerUser,
                      },
                      {
                        key: "s1",
                        label: "Support 1",
                        user: selected.reviewerSupport1,
                      },
                      {
                        key: "s2",
                        label: "Support 2",
                        user: selected.reviewerSupport2,
                      },
                      {
                        key: "s3",
                        label: "Support 3",
                        user: selected.reviewerSupport3,
                      },
                    ].map(
                      (reviewer) =>
                        (selected as any)?.[`p1_${reviewer.key}_rate`] !==
                          undefined && (
                          <div
                            key={reviewer.key}
                            className="flex flex-col gap-1 border p-3 rounded bg-slate-50/50"
                          >
                            <Label className="text-xs uppercase text-slate-500 font-bold">
                              {reviewer.label} ({reviewer.user?.name || "N/A"})
                            </Label>
                            <div className="flex gap-3 items-end">
                              <div className="flex-1">
                                <Label className="text-[10px]">Impact</Label>
                                <Input
                                  readOnly
                                  value={
                                    (selected as any)[
                                      `p1_${reviewer.key}_impact`
                                    ] as string
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-[10px]">Quality</Label>
                                <Input
                                  readOnly
                                  value={
                                    (selected as any)[
                                      `p1_${reviewer.key}_quality`
                                    ] as string
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-[10px]">
                                  Innovation
                                </Label>
                                <Input
                                  readOnly
                                  value={
                                    (selected as any)[
                                      `p1_${reviewer.key}_innovation`
                                    ] as string
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="w-20">
                                <Label className="text-[10px] font-bold">
                                  Total
                                </Label>
                                <Input
                                  readOnly
                                  value={
                                    (selected as any)[
                                      `p1_${reviewer.key}_rate`
                                    ] as string
                                  }
                                  className="h-8 text-sm font-bold bg-slate-100"
                                />
                              </div>
                            </div>
                          </div>
                        ),
                    )}

                    {selected?.phase1_general_rate && (
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-100">
                        <Label className="font-bold text-blue-700">
                          PHASE 1 GENERAL RATE
                        </Label>
                        <span className="text-2xl font-black text-blue-800">
                          {selected.phase1_general_rate}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Separator />
                {(selected?.phase2_general_rate ||
                  selected?.p2_m_rate ||
                  selected?.p2_s1_rate ||
                  selected?.p2_s2_rate ||
                  selected?.p2_s3_rate) && (
                  <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">Scores: PHASE 2</h1>

                    {[
                      {
                        key: "m",
                        label: "Main Reviewer",
                        user: selected.reviewerUser,
                      },
                      {
                        key: "s1",
                        label: "Support 1",
                        user: selected.reviewerSupport1,
                      },
                      {
                        key: "s2",
                        label: "Support 2",
                        user: selected.reviewerSupport2,
                      },
                      {
                        key: "s3",
                        label: "Support 3",
                        user: selected.reviewerSupport3,
                      },
                    ].map(
                      (reviewer) =>
                        (selected as any)?.[`p2_${reviewer.key}_rate`] !==
                          undefined && (
                          <div
                            key={reviewer.key}
                            className="flex flex-col gap-1 border p-3 rounded bg-slate-50/50"
                          >
                            <Label className="text-xs uppercase text-slate-500 font-bold">
                              {reviewer.label} ({reviewer.user?.name || "N/A"})
                            </Label>
                            <div className="flex gap-3 items-end">
                              <div className="flex-1">
                                <Label className="text-[10px]">Impact</Label>
                                <Input
                                  readOnly
                                  value={
                                    (selected as any)[
                                      `p2_${reviewer.key}_impact`
                                    ] as string
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-[10px]">Quality</Label>
                                <Input
                                  readOnly
                                  value={
                                    (selected as any)[
                                      `p2_${reviewer.key}_quality`
                                    ] as string
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-[10px]">
                                  Innovation
                                </Label>
                                <Input
                                  readOnly
                                  value={
                                    (selected as any)[
                                      `p2_${reviewer.key}_innovation`
                                    ] as string
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="w-20">
                                <Label className="text-[10px] font-bold">
                                  Total
                                </Label>
                                <Input
                                  readOnly
                                  value={
                                    (selected as any)[
                                      `p2_${reviewer.key}_rate`
                                    ] as string
                                  }
                                  className="h-8 text-sm font-bold bg-slate-100"
                                />
                              </div>
                            </div>
                          </div>
                        ),
                    )}

                    {selected?.phase2_general_rate && (
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-100">
                        <Label className="font-bold text-blue-700">
                          PHASE 2 GENERAL RATE
                        </Label>
                        <span className="text-2xl font-black text-blue-800">
                          {selected.phase2_general_rate}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Separator />
                {/* --- SECCIÓN DE HISTORIAL DE ARCHIVOS --- */}
                {(selected?.fileVersion1 || selected?.fullFileUrlVersion1) && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-700">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Document History
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* FASE 1 */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase 1 Versions</p>
                        <VersionLink label="Current" url={selected.file} isMain />
                        <VersionLink label="Version 1" url={selected.fileVersion1} />
                        <VersionLink label="Version 2" url={selected.fileVersion2} />
                      </div>
                      {/* FASE 2 */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase 2 Versions</p>
                        <VersionLink label="Current Full Paper" url={selected.fullFileUrl} isMain />
                        <VersionLink label="Version 1" url={selected.fullFileUrlVersion1} />
                        <VersionLink label="Version 2" url={selected.fullFileUrlVersion2} />
                      </div>
                    </div>
                  </div>
                )}
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

            {/* Este bloque renderiza los controles cuando el administrador elige 
    cambiar el estado de un paper (Recibir, Enviar, Asignar, Revisar, Aprobar, Desestimar u OBSERVAR)
*/}
            {(action === "receive-paper" ||
              action === "send-paper" ||
              action === "assign-paper" ||
              action === "review-paper" ||
              action === "approve-paper" ||
              action === "dismiss-paper" ||
              action === "reassign-paper" || // <--- Se añadió reassign-paper aquí
              action === "observe-paper") && ( // <--- Se añadió observe-paper aquí
              <div className="flex flex-row gap-3 p-3 rounded-md mb-3 items-center border bg-slate-50 dark:bg-slate-900">
                {/* Si es para enviar a un Líder */}
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
                            {categoryUsers.map((leader) => (
                              <CommandItem
                                key={leader.id}
                                onSelect={() =>
                                  setSelectedLeader(
                                    selectedLeader?.id === leader.id
                                      ? null
                                      : leader,
                                  )
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedLeader?.id === leader.id
                                      ? "opacity-100"
                                      : "opacity-0",
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

                {/* Si es para asignar a un Revisor */}
                {/* {action === "assign-paper" && (
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
                                onSelect={() =>
                                  setSelectedReviewer(
                                    selectedReviewer?.id === reviewer.id
                                      ? null
                                      : reviewer,
                                  )
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedReviewer?.id === reviewer.id
                                      ? "opacity-100"
                                      : "opacity-0",
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
                )} */}

                {/* --- BLOQUE DE ASIGNACIÓN DE REVISORES (PRINCIPAL Y APOYO) --- */}
                {(action === "assign-paper" || action === "reassign-paper") && (
                  <div className="flex flex-col gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 w-full">
                    <TypographyH4 className="text-sm font-bold uppercase text-slate-500">
                      {action === "assign-paper"
                        ? "Assign Review Team"
                        : "Reassign Review Team"}
                    </TypographyH4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* REVISOR PRINCIPAL */}
                      <div className="flex flex-col gap-2">
                        <Label>Main Reviewer (Responsible)</Label>
                        <Select
                          value={mainReviewer}
                          onValueChange={setMainReviewer}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Main Reviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryReviewers
                              .filter(
                                (u) =>
                                  u.id.toString() === mainReviewer ||
                                  (u.id.toString() !== support1 &&
                                    u.id.toString() !== support2 &&
                                    u.id.toString() !== support3),
                              )
                              .map((u) => (
                                <SelectItem key={u.id} value={u.id.toString()}>
                                  {u.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* APOYO 1 */}
                      <div className="flex flex-col gap-2">
                        <Label>Support Reviewer 1</Label>
                        <Select value={support1} onValueChange={setSupport1}>
                          <SelectTrigger>
                            <SelectValue placeholder="Optional support" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {categoryReviewers
                              .filter(
                                (u) =>
                                  u.id.toString() === support1 ||
                                  (u.id.toString() !== mainReviewer &&
                                    u.id.toString() !== support2 &&
                                    u.id.toString() !== support3),
                              )
                              .map((u) => (
                                <SelectItem key={u.id} value={u.id.toString()}>
                                  {u.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* APOYO 2 */}
                      <div className="flex flex-col gap-2">
                        <Label>Support Reviewer 2</Label>
                        <Select value={support2} onValueChange={setSupport2}>
                          <SelectTrigger>
                            <SelectValue placeholder="Optional support" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {categoryReviewers
                              .filter(
                                (u) =>
                                  u.id.toString() === support2 ||
                                  (u.id.toString() !== mainReviewer &&
                                    u.id.toString() !== support1 &&
                                    u.id.toString() !== support3),
                              )
                              .map((u) => (
                                <SelectItem key={u.id} value={u.id.toString()}>
                                  {u.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* APOYO 3 */}
                      <div className="flex flex-col gap-2">
                        <Label>Support Reviewer 3</Label>
                        <Select value={support3} onValueChange={setSupport3}>
                          <SelectTrigger>
                            <SelectValue placeholder="Optional support" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {categoryReviewers
                              .filter(
                                (u) =>
                                  u.id.toString() === support3 ||
                                  (u.id.toString() !== mainReviewer &&
                                    u.id.toString() !== support1 &&
                                    u.id.toString() !== support2),
                              )
                              .map((u) => (
                                <SelectItem key={u.id} value={u.id.toString()}>
                                  {u.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      disabled={loading || !mainReviewer}
                      type="button"
                      onClick={() => {
                        if (selected) {
                          changeStatusPaper({
                            state: StatePaper.ASSIGNED,
                            reviewerUserId:
                              mainReviewer && mainReviewer !== ""
                                ? Number(mainReviewer)
                                : null,
                            reviewerSupport1Id:
                              support1 && support1 !== "none"
                                ? Number(support1)
                                : null,
                            reviewerSupport2Id:
                              support2 && support2 !== "none"
                                ? Number(support2)
                                : null,
                            reviewerSupport3Id:
                              support3 && support3 !== "none"
                                ? Number(support3)
                                : null,
                          });
                        }
                      }}
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Confirm Assignment"
                      )}
                    </Button>
                  </div>
                )}

                {/* Si es para aprobar y asignar tipo (Oral/Poster) */}
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
                            ? `${paperTypes.find((type) => type.id === selectedTypePaper)?.name}`
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
                                  onSelect={() =>
                                    setSelectedTypePaper(
                                      selectedTypePaper === typePaper.id
                                        ? null
                                        : typePaper.id,
                                    )
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedTypePaper === typePaper.id
                                        ? "opacity-100"
                                        : "opacity-0",
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

                {/* BOTÓN FINAL DE ACCIÓN */}
                {action !== "assign-paper" && action !== "reassign-paper" && (
                  <Button
                    disabled={
                      loading ||
                      (action === "send-paper" && !selectedLeader) ||
                      (selected?.process === ProcessPaper.SELECCIONADO &&
                        action === "approve-paper" &&
                        !selectedTypePaper)
                    }
                    type="button"
                    onClick={handleChangeStatus}
                    className={cn(
                      "font-bold py-2 px-4 rounded duration-300 text-white",
                      action === "observe-paper"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-primary",
                    )}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoaderCircle
                          size={24}
                          className="animate-spin text-white"
                        />
                      </div>
                    ) : action === "observe-paper" ? (
                      "Confirm Observation"
                    ) : (
                      "Change status"
                    )}
                  </Button>
                )}
              </div>
            )}

            {action === "rate-paper" && selected && (
              <div className="space-y-6">
                <TypographyH4 className="text-lg font-bold border-b pb-2">
                  {selected.process === ProcessPaper.PRESELECCIONADO
                    ? "PHASE 1 SCORES"
                    : "PHASE 2 SCORES"}
                </TypographyH4>

                {[
                  {
                    id: selected.reviewerUserId,
                    name: selected.reviewerUser?.name || "Main Reviewer",
                    slot: "m",
                    label: "Main Reviewer",
                  },
                  {
                    id: selected.reviewerSupport1Id,
                    name: selected.reviewerSupport1?.name || "Support 1",
                    slot: "s1",
                    label: "Support Reviewer 1",
                  },
                  {
                    id: selected.reviewerSupport2Id,
                    name: selected.reviewerSupport2?.name || "Support 2",
                    slot: "s2",
                    label: "Support Reviewer 2",
                  },
                  {
                    id: selected.reviewerSupport3Id,
                    name: selected.reviewerSupport3?.name || "Support 3",
                    slot: "s3",
                    label: "Support Reviewer 3",
                  },
                ]
                  .filter((rev) => rev.id) // Solo mostrar si hay revisor asignado
                  .map((rev) => {
                    const isCurrentUser = user?.id === rev.id;
                    const phasePrefix =
                      selected.process === ProcessPaper.PRESELECCIONADO
                        ? "p1"
                        : "p2";

                    // Values for display if not current user
                    const displayImpact =
                      (selected as any)[`${phasePrefix}_${rev.slot}_impact`] ||
                      0;
                    const displayQuality =
                      (selected as any)[`${phasePrefix}_${rev.slot}_quality`] ||
                      0;
                    const displayInnovation =
                      (selected as any)[
                        `${phasePrefix}_${rev.slot}_innovation`
                      ] || 0;
                    const displayRate =
                      (selected as any)[`${phasePrefix}_${rev.slot}_rate`] || 0;

                    return (
                      <div
                        key={rev.slot}
                        className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <Label className="font-bold text-blue-600 uppercase text-xs">
                            {rev.label}:{" "}
                            <span className="text-slate-900 dark:text-slate-100 ml-1">
                              {rev.name}
                            </span>
                          </Label>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              YOU
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <div className="w-full">
                            <Label className="text-[10px] uppercase text-slate-500">
                              Impact
                            </Label>
                            <Input
                              name="score1"
                              onChange={handleInputRate}
                              type="number"
                              placeholder="Impact"
                              className="w-full h-8 text-sm"
                              value={
                                isCurrentUser ? rating.score1 : displayImpact
                              }
                              disabled={!isCurrentUser}
                            />
                          </div>
                          <div className="w-full">
                            <Label className="text-[10px] uppercase text-slate-500">
                              Quality
                            </Label>
                            <Input
                              name="score2"
                              onChange={handleInputRate}
                              type="number"
                              placeholder="Quality"
                              className="w-full h-8 text-sm"
                              value={
                                isCurrentUser ? rating.score2 : displayQuality
                              }
                              disabled={!isCurrentUser}
                            />
                          </div>
                          <div className="w-full">
                            <Label className="text-[10px] uppercase text-slate-500">
                              Innovation
                            </Label>
                            <Input
                              name="score3"
                              onChange={handleInputRate}
                              type="number"
                              placeholder="Innovation"
                              className="w-full h-8 text-sm"
                              value={
                                isCurrentUser
                                  ? rating.score3
                                  : displayInnovation
                              }
                              disabled={!isCurrentUser}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="text-xs font-bold">
                            Rate:{" "}
                            <span className="text-blue-600">
                              {isCurrentUser
                                ? (
                                    (Number(rating.score1) +
                                      Number(rating.score2) +
                                      Number(rating.score3)) /
                                    3
                                  ).toFixed(2)
                                : Number(displayRate).toFixed(2)}
                            </span>
                          </div>
                          {isCurrentUser && (
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
                              size="sm"
                              className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700"
                            >
                              {loading ? (
                                <LoaderCircle
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                "SAVE SCORE"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                <div className="mt-6 p-4 bg-blue-600 text-white rounded-lg flex justify-between items-center shadow-md">
                  <div className="font-bold uppercase tracking-wider">
                    General Rate (Phase{" "}
                    {selected.process === ProcessPaper.PRESELECCIONADO
                      ? "1"
                      : "2"}
                    )
                  </div>
                  <div className="text-2xl font-black">
                    {realTimeGeneralRate}
                  </div>
                </div>

                {errorRating && (
                  <p className="text-red-500 text-sm mt-2">{errorRating}</p>
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

const VersionLink = ({ label, url, isMain }: { label: string, url: string | undefined | null, isMain?: boolean }) => {
  if (!url) return null;
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center justify-between p-2 rounded-md border transition-colors ${
        isMain 
        ? "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700 font-medium" 
        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-600 shadow-sm"
      }`}
    >
      <span className="text-xs uppercase font-bold">{label}</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  );
};
export default PapersDialog;
