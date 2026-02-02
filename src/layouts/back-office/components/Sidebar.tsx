import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Pyramid } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components';
import { cn } from '@/lib/utils';
import { TypographyLead } from '@/shared/typography';
import { Group, MenuItem } from '@/models';
import { useSessionBoundStore } from '@/modules/back-office/auth/store';
import { Menu } from './Menu';
import { Debugger } from '@/modules/back-office/debugger';

interface SidebarProps {
    isExpand: boolean;
    setIsExpand: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpand, setIsExpand }) => {
    const session = useSessionBoundStore((state) => state.session);
    const groups = useSessionBoundStore((state) => state.groups);
    const location = useLocation();
    const [menuItemsSelected, setMenuItemsSelected] = useState<Group>(groups[0]);
    const [activeGroup, setActiveGroup] = useState<Group | null>(null);

    const handleChangeItemsMenu = (item: Group) => {
        setMenuItemsSelected(item);
        setIsExpand(true);
    }

    const isActive = (group: Group) => {
        const isGroupActive = (items: MenuItem[]): boolean => {
            return items.some(item => {
                if (location.pathname.startsWith(item.url || '')) {
                    return true;
                }
                if (item.items) {
                    return isGroupActive(item.items);
                }
                return false;
            });
        };

        return group.menus.some(menu => isGroupActive([menu]));
    };


    const renderNavItem = (
        group: Group,
        isItemActive: boolean
    ) => (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        to={'#'}
                        onClick={() => handleChangeItemsMenu(group)}
                        className={cn(
                            "group flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white text-lg font-semibold text-primary-foreground md:text-base transition-all duration-500 md:h-9 md:w-9 hover:bg-accent hover:text-primary-foreground hover:scale-105 shadow-lg shadow-primary-dark/30 dark:shadow-background/100",
                            isItemActive ? 'bg-primary md:h-10 md:w-10 hover:bg-primary/90' : 'bg-background-container text-background-container-foreground'
                        )}
                    >
                        <group.icon className={cn(
                            "h-6 w-6",
                            isItemActive ? 'text-white hover:text-white/90' : 'text-muted-foreground'
                        )} />
                        <span className="sr-only">{group.name}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{group.name}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    const allowedGroups = useMemo(() => {
        if (!session) {
            return [];
        }
        // Extrae los módulos permitidos del objeto session.
        const allowedModules = new Set(
            session.user.role.permissions.map((permission) => permission.module)
        );

        // Filtra los grupos y menús de acuerdo a los permisos
        return groups
            .map((group) => {
                const allowedMenus = group.menus
                    .map((menu) => {
                        // Filtra los items dentro de cada menú si existen
                        const allowedItems = menu.items?.filter((item) =>
                            allowedModules.has(item.module)
                        );

                        // Incluye el menú si tiene permisos y tiene items permitidos
                        return allowedModules.has(menu.module) || allowedItems?.length
                            ? { ...menu, items: allowedItems }
                            : null;
                    })
                    .filter(Boolean); // Remueve los elementos null

                // Incluye el grupo si tiene algún menú permitido
                return allowedMenus.length > 0 ? { ...group, menus: allowedMenus } : null;
            })
            .filter(Boolean); // Remueve los elementos null
    }, [groups, session]);

    useEffect(() => {
        const currentActiveGroup = allowedGroups.find(group => isActive(group as any)) || null;
        setActiveGroup(currentActiveGroup as any);
        if (currentActiveGroup) {
            setMenuItemsSelected(currentActiveGroup as any);
        }
    }, [location.pathname, allowedGroups]);

    return (
        <React.Fragment>
            <aside className={cn(
                "fixed w-14 inset-y-0 left-0 z-20 hidden flex-col border-none sm:flex transition-all duration-300",
            )}>
                <nav className="flex flex-col items-center gap-2 px-2 sm:py-5">
                    <Link
                        to={"#"}
                        className={cn(
                            "group flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold bg-primary-dark-foreground md:text-base transition-all duration-500 md:h-10 md:w-10",
                        )}
                        onClick={() => setIsExpand(!isExpand)}
                    >
                        <Pyramid className={cn(
                            "h-6 w-6 transition-all group-hover:scale-110 text-primary-dark",
                        )} />
                        <span className="sr-only">Prisma</span>
                    </Link>
                    <div className="flex flex-col items-center gap-4 px-2 sm:py-5">
                        {allowedGroups.map((item) => (
                            <div key={item?.name} className={cn('transition-all duration-400')}>
                                {renderNavItem(
                                    item as any,
                                    activeGroup?.name === item?.name
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    {/* TODO: Add settings */}
                    {/* {renderNavItem(
                        { name: 'Settings', icon: Settings, menus: [{ name: 'Settings', url: '/settings' }] },
                        location.pathname.startsWith('/settings')
                    )} */}
                    {/* renderizar solo cuando es entorno development */}
                    {process.env.NODE_ENV === 'development' && <Debugger />}
                </nav>
            </aside>
            <aside className={cn(
                "hidden fixed inset-y-0 left-14 z-10 flex-col border-none sm:flex transition-all duration-300",
                isExpand ? "w-64 block" : "w-0"
            )}>
                <nav className="flex flex-col items-center gap-2 px-2 sm:py-5">
                    <Link
                        to={"#"}
                        className={cn(
                            "group hidden h-10 w-full shrink-0 items-center text-left justify-start px-6 gap-2 rounded-full text-lg font-semibold text-black md:text-base transition-all ease-in-out duration-300",
                            isExpand ? "flex" : ""
                        )}
                        onClick={() => setIsExpand(!isExpand)}
                    >
                        <span className="sr-only">World Mining Congress 2026</span>
                        <TypographyLead className={cn(
                            "text-primary-dark transition-all duration-300 font-extrabold text-sm",
                            isExpand ? "block" : "hidden"
                        )}>World Mining Congress 2026</TypographyLead>
                    </Link>
                    {isExpand && menuItemsSelected && (
                        <Menu group={menuItemsSelected} />
                    )}
                </nav>
            </aside>
        </React.Fragment>
    );
};
