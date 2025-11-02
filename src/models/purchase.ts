import { PaymentItem } from "./sale";

export interface Purchase {
  subsidiaryId: string;
  type:         string;
  createdById:  string;
  data:         DetailPurchase;
  createdAt:    string;
  id:           string;
}

export interface DetailPurchase {
  supplierId:             string;
  items:                  PurchaseItem[];
  total:                  number;
  transactionDocumentId?: string;
  paymentItems?:          PaymentItem[];
  generateCashFlow?:      boolean;
}

export interface PurchaseItem {
  productId:     string;
  quantity:      number;
  purchasePrice: number;
  id:            string;
}

export enum PurchaseType {
  CashBox = "cash_box",
  Purchase = "purchase",
}

export const MapPurchaseType: Record<PurchaseType, string> = {
  [PurchaseType.CashBox]: "Caja",
  [PurchaseType.Purchase]: "Compra",
};

export interface PayloadPurchase {
  items: PayloadPurchaseItem[];
  total: number;
  paymentItems: PaymentItem[];
  transactionDocumentId: string;
  supplierId: string;
  generateCashFlow: boolean;
}

export interface PayloadPurchaseItem {
  productId: string;
  quantity: number;
  purchasePrice: number;
}
