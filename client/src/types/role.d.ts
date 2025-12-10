export interface RoleResponse {
    status: string;
    data: RoleData;
}

export interface RoleDataPage {
    page: number;       
    limit: number;      
    total: number;      
    data: RoleItem[];    
}

export interface RoleItem {
    user_id: number;
    avartar: string | null;
    first_name: string;
    last_name: string | null;  
    email: string;
    role: string;
}
