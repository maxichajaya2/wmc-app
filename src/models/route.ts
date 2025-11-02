export interface Group {
  name: string;
  icon: any;
  menus: MenuItem[];
  url?: string;
}
export interface MenuItem {
  name: string;
  module: string;
  items?: MenuItem[];
  badge?: number;
  url?: string;
}
