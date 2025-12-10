// types/order.ts

export type OrderInterface = {
  sku: string;
  customerName: string;
  orderDate: string;
  quantity: number;
  totalAmount: number;
  tracking_number: string;
  paymentStatus: "pending" | "confirmed" | "checking" | "shipped" | "completed" | "canceled";
};

export interface OrderResponse {
  status: string;
  data: OrdersData;
}

  export interface OrdersData {
    totalOrders: number;
    pendingOrdersCount: number;
    DeliveryCount: number;
    CompleateCount: number;
    orders: OrderDetails[];
  }
  
  export interface OrderDetails {
    id_order: number;
    created_at: string;
    status: "pending" | "confirmed" | "checking" | "shipped" | "completed" | "canceled";
    user: OrderUser
    order_items_count: number;
    dynamic_total_price: number;
    payment: OrderPayment | null;
    tracking_number: string;
  }
  
  export interface OrderUser {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
  }

  
  export interface OrderPayment {
    payment_id: string;
    payment_method: string;
    transaction_id: string | null;
    created_at: string;
    amount: number;
  }
  