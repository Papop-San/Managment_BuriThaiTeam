export interface CategoryResponse {
  status: string;
  data: PaginatedCategory;
}

export interface PaginatedCategory {
  page: number;
  limit: number;
  total: number;
  data: CategoryData[];
}

export interface CategoryData {
    id_category: number;
    name: string;
    parent_id: number | null;
}