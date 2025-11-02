export const PAYMENT_METHODS = [
  {
    id: 1,
    name: "Efectivo",
    value: "cash",
    icon: "cash",
  },
  {
    id: 2,
    name: "Yape",
    value: "yape",
    icon: "yape",
  },
  {
    id: 3,
    name: "Plin",
    value: "plin",
    icon: "plin",
  },
  {
    id: 4,
    name: "Depósito",
    value: "deposit",
    icon: "deposit",
  },
  {
    id: 5,
    name: "Otros",
    value: "others",
    icon: "others",
  },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
