import { Button, Dialog, DialogContent, DialogTrigger, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Tabs, TabsContent, TabsList, TabsTrigger, DialogDescription, DialogTitle, DialogFooter } from '@/components';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from 'react';
import { useMenuStore } from '../store/menu.store';
import { usePageStore } from '@/modules/back-office/pages/store/pages.store';
import { TypographyH4 } from '@/shared';
import { LoaderCircle } from 'lucide-react';

const FormSchema = z.object({
  isParent: z.boolean().default(true).optional(),
  parentId: z.preprocess((val) => Number(val || ''), z.number().optional()),
  isExternalUrl: z.boolean().default(false).optional(),
  url: z.string().optional(),
  pageId: z.preprocess((val) => Number(val || ''), z.number().optional()),
  titleEs: z.string().min(1, {
    message: "Es un campo requerido",
  }),
  titleEn: z.string().min(1, {
    message: "Es un campo requerido",
  }),
  sort: z.preprocess((val) => Number(val), z.number().default(0).optional()),
  isActive: z.boolean().default(true).optional(),
}).superRefine((val, ctx) => {
  if (!val.isParent && !val.parentId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["idParent"],
      message: "Menú padre es requerido",
    });
  }
  if (val.isExternalUrl && val.url && !val.url.includes("https://")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["url"],
      message: "Ingrese una Url válida https://example.com",
    });
  }
  if (!val.isExternalUrl && !val.pageId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pageId"],
      message: "La página es requerida",
    });
  }
}).transform((val) => {
  let response = val
  if (val.isParent) {
    response = {
      ...response,
      parentId: undefined,
    }
  }
  if (val.isExternalUrl) {
    response = {
      ...response,
      pageId: undefined,
    }
  } else {
    response = {
      ...response,
      url: undefined,
    }
  }
  return { ...response }
})

const MenuDialog = React.forwardRef<HTMLDivElement>((_, ref) => {
  const filtered = useMenuStore(state => state.filtered)
  const isOpenDialog = useMenuStore(state => state.isOpenDialog)
  const closeActionModal = useMenuStore(state => state.closeActionModal)
  const menuSelected = useMenuStore(state => state.selected)
  const loading = useMenuStore(state => state.loading)
  const action = useMenuStore(state => state.action)
  const create = useMenuStore(state => state.create)
  const update = useMenuStore(state => state.update)
  const remove = useMenuStore(state => state.remove)
  const pages = usePageStore(state => state.data)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isParent: true,
      parentId: menuSelected?.parentId || undefined,
      isExternalUrl: menuSelected?.isExternalUrl || false,
      url: menuSelected?.url || '',
      pageId: menuSelected?.pageId || undefined,
      titleEs: menuSelected?.titleEs || "",
      titleEn: menuSelected?.titleEn || "",
      sort: 0,
      isActive: true,
    },
  })

  React.useEffect(() => {
    if (menuSelected) {
      if (action === 'edit') {
        console.log({ menuSelected }, 'edit')
        form.reset({
          isParent: menuSelected.parentId ? false : true,
          parentId: menuSelected.parentId,
          isExternalUrl: menuSelected.isExternalUrl,
          url: menuSelected.url ?? undefined,
          pageId: menuSelected.pageId,
          titleEs: menuSelected.titleEs,
          titleEn: menuSelected.titleEn,
          sort: menuSelected.sort,
          isActive: menuSelected.isActive,
        })
      } else if (action === 'create') {
        console.log({ menuSelected }, 'create with parent')
        form.reset({
          isParent: false,
          parentId: menuSelected.id,
          isExternalUrl: false,
          url: "",
          pageId: undefined,
          titleEs: "",
          titleEn: "",
          sort: 0,
          isActive: true,
        })
      } else if (action === 'create-with-parent') {
        console.log({ menuSelected }, 'create with parent')
        form.reset({
          isParent: false,
          parentId: undefined,
          isExternalUrl: false,
          url: "",
          pageId: undefined,
          titleEs: "",
          titleEn: "",
          sort: 0,
          isActive: true,
        })
      }
    }
  }, [menuSelected, action])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log({ data, action })
    if (action === 'create' || action === 'create-with-parent') {
      return create({ ...data, isParent: undefined })
    }
    if (action === 'edit') {
      return update({ ...data, isParent: undefined })
    }
    if (action === 'delete') {
      return remove()
    }
  }

  return (
    <div ref={ref}>
      <Dialog open={isOpenDialog} onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset()
          closeActionModal()
        }
      }} modal={true}>
        <DialogTrigger />
        <DialogDescription />
        <DialogContent>
          <DialogTitle>{(action === "edit" || action === "delete") ? menuSelected?.titleEs : ''}</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <pre className="text-xs hidden">
                <code>
                  {JSON.stringify({ form: form.formState.errors, values: form.watch() }, null, 4)}
                </code>
              </pre>
              {action === 'delete' && (
                <div>
                  <TypographyH4 className="">
                    ¿Estás seguro de eliminar a {menuSelected?.titleEs}?
                  </TypographyH4>
                </div>
              )}
              {(action === 'create' || action === 'edit' || action === "create-with-parent") && (
                <div className="grid grid-cols-2 items-start gap-3">
                  <div>
                    <FormField
                      name="isParent"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-2">
                          <div className="space-y-0.5">
                            <FormLabel>Menú Padre</FormLabel>
                            <FormDescription>
                              Activa esta opción si este menú no depende de otro.
                            </FormDescription>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {!form.watch("isParent") && (
                      <FormField
                        name="parentId"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="rounded-lg border p-3 shadow-sm">
                            <FormLabel>Selector de Menu</FormLabel>
                            <FormDescription>
                              Selecciona el menú al que pertenecerá este submenú.
                            </FormDescription>
                            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar menú padre" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {filtered.map((item) => (
                                  <SelectItem key={item.id} value={item.id.toString()}>{item.titleEs}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div>
                    <FormField
                      name="isExternalUrl"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-2">
                          <div className="space-y-0.5">
                            <FormLabel>Url Externa</FormLabel>
                            <FormDescription>
                              Activa esta opción si el enlace dirige a una página externa.
                            </FormDescription>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {form.watch("isExternalUrl") ? (
                      <FormField
                        name="url"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="rounded-lg border p-3 shadow-sm">
                            <FormLabel>Url</FormLabel>
                            <FormDescription>
                              Ingresa la URL externa a la que dirigirá este menú
                            </FormDescription>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Url"
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <FormField
                        name="pageId"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="rounded-lg border p-3 shadow-sm">
                            <FormLabel>Selector de páginas</FormLabel>
                            <FormDescription>
                              Selecciona la página a la que dirigirá este menú.
                            </FormDescription>
                            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()} >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar página" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {pages.map((page) => (
                                  <SelectItem key={page.id} value={page.id.toString()}>{page.titleEs}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Nro de Orden */}
                  <FormField
                    name="sort"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="rounded-lg border p-3 shadow-sm col-span-2">
                        <FormLabel>Nro. de Orden</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Nro. de Orden"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Tabs for languages */}
                  <div className="space-y-4 col-span-2">
                    <Tabs defaultValue="spanish" className="w-full">
                      <TabsList className="w-full">
                        <TabsTrigger value="spanish" className="w-full">Español</TabsTrigger>
                        <TabsTrigger value="english" className="w-full">Inglés</TabsTrigger>
                      </TabsList>
                      <TabsContent value="spanish">
                        <FormField
                          name="titleEs"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="rounded-lg border p-3 shadow-sm">
                              <FormLabel>Nombre del Menú (Español)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Nombre del Menú"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      <TabsContent value="english">
                        <FormField
                          name="titleEn"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="rounded-lg border p-3 shadow-sm">
                              <FormLabel>Nombre del Menú (Inglés)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Nombre del Menú"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  <FormField
                    name="isActive"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-2 col-span-2">
                        <div className="space-y-0.5">
                          <FormLabel>Activar</FormLabel>
                          <FormDescription>
                            Si lo oculta, no se mostrará en la lista.
                          </FormDescription>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <DialogFooter className='col-span-1 md:col-span-2 ml-auto flex flex-row gap-2'>
                <Button
                  disabled={loading}
                  type="submit"
                  className="font-bold py-2 px-4 rounded duration-300 text-white">
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <LoaderCircle size={24} className="animate-spin text-white" />
                    </div>
                  ) : "Guardar"}
                </Button>
                <Button
                  disabled={loading}
                  onClick={closeActionModal}
                  className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300">
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default MenuDialog;