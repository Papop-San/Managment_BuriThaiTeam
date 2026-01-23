// types/dashboard.d.ts
export interface DashboardResponse {
    status: string;
    data: DashboardData;
  }
  
  export interface DashboardData {
    totalUsers: number;
    recentUsers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrdersCount: number;
    websiteStatus: string;
    bestseller: BestsellerProduct[];
  }
  
  export interface BestsellerProduct {
    productId: number;
    productName: string;
    totalQuantitySold: number;
    lastOrderDate: string;
    Image: ProductImage[];
  }
  
  export interface ProductImage {
    img_id: number;
    productId: number;
    url: string;
    is_cover: boolean;
    type: string;
    created_at: string; 
    updated_at: string; 
  }
  

export interface PopularResponse{
  status: string;
  data: PopularData;
} 

export interface PopularData{
   year: number;
   Top5PopularChart: TopProductTableItem[];
   Top5PopularMonthlyBarChart: MonthlyPopularItem[]
   TablePopular: TopProductTableItem[];

}

export interface MonthlyPopularItem {
  month: string;
  [productName: string]: number | string;
}

export interface TopProductTableItem {
  rank: number;
  productName: string;
  totalQuantity: number;
}