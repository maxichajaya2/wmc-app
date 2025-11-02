import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components';
import React from 'react';
import { ROUTES_PATHS } from '@/constants';
import { MenuItem, Group } from '@/models';
import { useSessionBoundStore } from '@/modules/back-office/auth/store';

export function Breadcrumbs() {
    const groups = useSessionBoundStore((state) => state.groups);
    const location = useLocation();
    const pathname = location.pathname;

    const getBreadcrumbs = (): { name: string; url: string | null }[] => {
        let breadcrumbs: { name: string; url: string | null }[] = [{ name: 'Inicio', url: ROUTES_PATHS.DASHBOARD }];

        if (pathname === ROUTES_PATHS.DASHBOARD) return breadcrumbs;

        let currentPath = '';
        let currentBreadcrumbs: { name: string; url: string | null }[] = [];

        const findInGroups = (items: Group[] | MenuItem[], path: string) => {
            for (const item of items) {
                if ('menus' in item) {
                    const found = findInGroups(item.menus, path);
                    if (found) {
                        currentBreadcrumbs.push({ name: item.name, url: null });
                        return true;
                    }
                } else if (item.url === path) {
                    currentBreadcrumbs.push({ name: item.name, url: item.url });
                    return true;
                } else if (item.items) {
                    const found = findInGroups(item.items, path);
                    if (found) {
                        currentBreadcrumbs.push({ name: item.name, url: item.url || null });
                        return true;
                    }
                }
            }
            return false;
        };

        const pathParts = pathname.split('/').filter(Boolean);
        for (const part of pathParts) {
            currentPath += `/${part}`;
            if (findInGroups(groups, currentPath)) {
                breadcrumbs = [...breadcrumbs, ...currentBreadcrumbs.reverse()];
                currentBreadcrumbs = [];
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <Breadcrumb className='hidden md:block'>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={breadcrumb.name}>
                        <BreadcrumbItem>
                            {index < breadcrumbs.length - 1 ? (
                                breadcrumb.url ? (
                                    <BreadcrumbLink asChild>
                                        <Link to={breadcrumb.url}>
                                            {breadcrumb.name}
                                        </Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <span>{breadcrumb.name}</span>
                                )
                            ) : (
                                <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}