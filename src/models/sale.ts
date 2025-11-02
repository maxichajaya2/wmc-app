import { Product } from "./product";

export interface Sale {
  data: DetailSale;
  type: SaleType;
  subsidiaryId: string;
  createdById: string;
  createdAt: string;
  id: string;
  remarks?: string;
}

export interface DetailSale {
  items: ProductItem[];
  paymentConceptId?: string;
  total: number;
  type?: SaleDataType;
  customerId?: string;
  paymentItems?: PaymentItem[];
}

export interface ProductItem {
  id: string;
  product: Product;
  productId?: string;
  amount?: number;
  remarks?: string;
  quantity?: number;
  salePrice?: number;
  createdAt?: string;
}

export interface PaymentItem {
  amount: number;
  paymentMethod: string;
}
// //cash, yape, plin, deposit, others
export enum PaymentMethod {
  Cash = "cash",
  Yape = "yape",
  Plin = "plin",
  // Deposit = "deposit",
  Others = "others",
}

export const MapPaymentMethod: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: "Efectivo",
  [PaymentMethod.Yape]: "Yape",
  [PaymentMethod.Plin]: "Plin",
  // TODO: Uncomment this line
  // [PaymentMethod.Deposit]: "Depósito",
  [PaymentMethod.Others]: "Otros",
};

export enum SaleType {
  CashBox = "cash_box",
  Sale = "sale",
}

export enum SaleDataType {
  Income = "income",
  Outcome = "outcome",
}

export const MapType: Record<SaleType, string> = {
  [SaleType.CashBox]: "Caja",
  [SaleType.Sale]: "Venta",
};

export const MapDataType: Record<SaleDataType, string> = {
  [SaleDataType.Income]: "Ingreso",
  [SaleDataType.Outcome]: "Egreso",
};

export interface PayloadSale {
  items: PayloadItem[];
  total: number;
  paymentItems: PaymentItem[];
  customerId: string;
}

export interface PayloadItem {
  productId: string;
  quantity: number;
  salePrice: number;
}
