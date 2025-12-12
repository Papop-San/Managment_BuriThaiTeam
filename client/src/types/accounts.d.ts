// account.d.ts

export interface RoleInfo {
  role_id: number;
  name: string;
}

export interface UserRoleRelation {
  role: RoleInfo;
}

export interface AccountItem {
  user_id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  gender: string;
  birthday: string;
  is_active: boolean;
  avatar: string;
  created_at: Date;
  updated_at: Date;
  userRoles: UserRoleRelation[];
}

export interface AccountPagination {
  page: number;
  limit: number;
  total: number;
  data: AccountItem[];
}

export interface AccountResponse {
  status: string;
  data: AccountPagination;
}

// -------- form types ----------
export type GenderType = "male" | "female" | "other";

export type AccountFormValues = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: GenderType | "";
  birthDate?: string;
  avatar?: File | null;
};