import { Person } from "./person";

export interface Supplier {
  personId: string;
  enterpriseId: string;
  userId: string;
  createdAt: string;
  id: string;
  person: Person;
}

export interface PayloadSupplier {
  person: Omit<Person, "id">;
}
