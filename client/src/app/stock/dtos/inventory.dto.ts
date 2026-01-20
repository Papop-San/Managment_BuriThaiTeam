export type Inventory = {
  inventory_id?: number;
  inventory_name: string;
  price: number;
  stock: number;
};

export type ProductImage = {
  img_id: number;
  url: string;
  type: "cover" | "slide";
  is_cover: boolean;
  created_at: string;
  updated_at: string;
};