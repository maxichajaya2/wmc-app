import { Person } from "./person";

export interface Customer {
  personId: string;
  enterpriseId: string;
  userId: string;
  createdAt: string;
  id: string;
  person: Person;
}

export interface PayloadCustomer {
  person: Omit<Person, "id">;
}
