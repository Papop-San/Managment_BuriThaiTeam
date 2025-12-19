export interface BannerResponse {
    status: string;
    data: BannerPagination;
  }
  
  export interface BannerPagination {
    page: number;
    limit: number;
    total: number;
    data: BannerItem[];
  }
  
  export interface BannerItem {
    banner_id: number;
    url_banner: string;
    order_banner: number;
    is_active: boolean;
  }