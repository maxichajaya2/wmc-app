

import * as React from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components';

// Tree Menu Dependencies
import { styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { CheckSquare, MinusSquare, PlusSquare } from "lucide-react";
import { MenuActionBar } from "./components/MenuBar";
import { FadeInComponent, Loader } from "@/shared";
import { useCheckPermission } from "@/utils";
import { ActionRoles, ModulesRoles } from "@/constants";
import { useMenuStore } from "./store/menu.store";
import { usePageStore } from "../pages/store/pages.store";
import MenuDialog from "./components/MenuDialog";

const CustomTreeItem = styled(TreeItem)({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
});
// const menuItems: MenuItem[] = [
//   {
//     id: 1,
//     title: "Menu 1",
//     href: "#",
//     children: [
//       {
//         id: 2,
//         idParent: 1,
//         title: "Submenu 1",
//         href: "#",
//       },
//       {
//         id: 3,
//         idParent: 1,
//         title: "Submenu 2",
//         href: "#",
//       },
//       {
//         id: 4,
//         idParent: 1,
//         title: "Submenu 3",
//         href: "#",
//       },
//       {
//         id: 5,
//         idParent: 1,
//         title: "Submenu 4",
//         href: "#",
//       },
//     ],
//   },
//   {
//     id: 6,
//     title: "Menu 2",
//     href: "#",
//     children: [
//       {
//         id: 7,
//         idParent: 6,
//         title: "Submenu 1",
//         href: "#",
//       },
//       {
//         id: 8,
//         idParent: 6,
//         title: "Submenu 2",
//         href: "#",
//       },
//       {
//         id: 9,
//         idParent: 6,
//         title: "Submenu 3",
//         href: "#",
//       },
//       {
//         id: 10,
//         idParent: 6,
//         title: "Submenu 4",
//         href: "#",
//       },
//     ],
//   },
//   {
//     id: 11,
//     title: "Menu 3",
//     href: "#",
//     children: [
//       {
//         id: 12,
//         idParent: 11,
//         title: "Submenu 1",
//         href: "#",
//       },
//       {
//         id: 13,
//         idParent: 11,
//         title: "Submenu 2",
//         href: "#",
//       },
//       {
//         id: 14,
//         idParent: 11,
//         title: "Submenu 3",
//         href: "#",
//       },
//       {
//         id: 15,
//         idParent: 11,
//         title: "Submenu 4",
//         href: "#",
//       },
//     ],
//   },
//   {
//     id: 16,
//     title: "Menu 4",
//     href: "#",
//     children: [
//       {
//         id: 17,
//         idParent: 16,
//         title: "Submenu 1",
//         href: "#",
//       },
//       {
//         id: 18,
//         idParent: 16,
//         title: "Submenu 2",
//         href: "#",
//       },
//       {
//         id: 19,
//         idParent: 16,
//         title: "Submenu 3",
//         href: "#",
//       },
//       {
//         id: 20,
//         idParent: 16,
//         title: "Submenu 4",
//         href: "#",
//       },
//     ],
//   },
//   {
//     id: 21,
//     title: "Menu 5",
//     href: "#",
//   },
// ]

function MenusPage() {
  const selected = useMenuStore(state => state.selected)
  const setSelected = useMenuStore(state => state.setSelected)
  const isOpenDialog = useMenuStore(state => state.isOpenDialog)
  const filtered = useMenuStore(state => state.filtered)
  const loading = useMenuStore(state => state.loading)
  const findAll = useMenuStore(state => state.findAll)
  const clearFilters = useMenuStore(state => state.clearFilters)
  const openActionModal = useMenuStore(state => state.openActionModal)
  const findPages = usePageStore(state => state.findAll)

  const hasReadPermission = useCheckPermission(
    ModulesRoles.DASHBOARD,
    ActionRoles.READ
  );

  React.useEffect(() => {
    if (hasReadPermission) {
      findPages()
      findAll()
    };

    return () => {
      clearFilters();
    };
  }, []);
  const handleEditMenu = () => {
    console.log({ selected, 'edit': true })
    if (!selected) return;
    openActionModal(selected.id, 'edit');
  }

  const handleCreateChildMenu = () => {
    if (!selected) return;
    if (selected.parentId === undefined) return;
    openActionModal(selected.id, 'create');
  }

  const handleCreateParentMenu = () => {
    openActionModal(0, 'create-with-parent');
  }

  const handleDeleteMenu = () => {
    if (!selected) return;
    openActionModal(selected.id, 'delete');
  }
  return (
    <main className="grid flex-1 items-start p-2 overflow-auto">

      <MenuActionBar
        onEditMenu={handleEditMenu}
        onCreateChildMenu={handleCreateChildMenu}
        onCreateParentMenu={handleCreateParentMenu}
        onDeleteMenu={handleDeleteMenu}
      />

      <div className="overflow-auto mt-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Menú</CardTitle>
            <CardDescription>
              Aquí puedes ver y editar los menús de tu web.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasReadPermission && (
              loading ? <Loader className="min-h-[650px]" /> : (
                <FadeInComponent className="overflow-auto">
                  <div className="p-2 w-full">
                    <SimpleTreeView
                      defaultExpandedItems={['grid']}
                      slots={{
                        expandIcon: PlusSquare,
                        collapseIcon: MinusSquare,
                        endIcon: CheckSquare,
                      }}
                      onItemFocus={(_event, itemId) => {
                        console.log({ itemId })
                        const menuItemsFlated = filtered.flatMap((item) => item.children ? [item, ...item.children] : [item])
                        const selectedMenu = menuItemsFlated.find((item) => item.id === Number(itemId))
                        console.log({ selectedMenu })
                        setSelected(selectedMenu || undefined)
                      }}
                    >
                      {filtered.map((item, idx) => (
                        item.children ? (
                          <CustomTreeItem itemId={item.id.toString()} label={item.titleEs} key={item.titleEs + idx}>
                            {item.children.map((child, idxx) => (
                              <CustomTreeItem itemId={child.id.toString()} label={child.titleEs} key={child.titleEs + idxx} />
                            ))}
                          </CustomTreeItem>
                        ) : (
                          <CustomTreeItem itemId={item.id.toString()} label={item.titleEs} key={item.titleEs + idx} />
                        )
                      ))}
                    </SimpleTreeView>
                  </div>
                </FadeInComponent>
              )
            )}
          </CardContent>
          <CardFooter />
        </Card>
      </div>

      {isOpenDialog && <MenuDialog />}
    </main>
  )
}

export default MenusPage


