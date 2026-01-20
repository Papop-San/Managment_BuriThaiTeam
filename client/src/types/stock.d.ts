//Main Stock

export interface StockResponse{
    status: string;
    data: StockPagination
}

export interface StockPagination {
    page: number;
    limit: number;
    total: number;
    data: StockItem[];
}

export interface StockItem {
    id_products: number;
    name: string;
    quality: string;
    category: {
        name: string
    }
    images: ImageItem[];
    variants: variantItems[];
  }

  export interface ImageItem {
    img_id: string;
    url: string;
    type: string; 
  }

export interface variantItems{
    variant_id: number;
    variant_name: string;
    inventories: InventoryItems[]
}

export interface InventoryItems{
    inventory_id: number;
    inventory_name: string;
    price: number;
    stock: number;
}

type StockRow = {
    product_id: number;
    product_name: string;
    image_url?: string;
    category_name: string;
  
    variant_id: number;
    variant_name: string;
  
    inventory_id: number;
    inventory_name: string;
    price: number;
    stock: number;
  };

