import type { Inventory } from "./inventory.dto";
import type {
  Control,
  UseFormRegister,
  UseFieldArrayRemove,
} from "react-hook-form";
import type { ProductFormValues } from "./product.dto";

export type ProductVariant = {
  variant_id?: number;
  variant_name: string;
  inventories: Inventory[];
};

export type VariantItemProps = {
  vIndex: number;
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  onDeleteVariant: (vIndex: number) => void;
  onDeleteInventory: (
    vIndex: number,
    iIndex: number,
    remove: UseFieldArrayRemove
  ) => void;
};