export type PaymentMethod = "PROMPTPAY" | "BANK";

// Base type สำหรับสร้างและอัปเดต
export interface BasePayment {
  first_name: string;
  last_name: string;
  payKey: string;
  payment_method: PaymentMethod;
  is_active: boolean;
}

export interface PaymentItem extends BasePayment {
  id: number;
}

export type CreatePaymentPayload = BasePayment;


export interface UpdatePaymentPayload extends BasePayment {
  id: number;
}
export interface PaymentsData {
  page: number;
  limit: number;
  total: number;
  data: PaymentItem[];
}

// Response API
export interface PaymentResponse {
  status: "success" | "error";
  data: PaymentsData;
}
