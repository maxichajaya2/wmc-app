export interface Permission {
    module: string;
    action: string;
    id:     number;
}

export interface PayloadPermission {
    action: string;
    module: string;
}
