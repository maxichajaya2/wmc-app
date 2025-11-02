export interface Subsidiary {
  name: string;
  address: string;
  image?: string;
  ruc: string;
  enterpriseId: string;
  id: string;
}

export interface PayloadSubsidiary {
  name: string;
  address: string;
  ruc: string;
}