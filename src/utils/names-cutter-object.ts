import { Person, PersonType } from "@/models";

export const namesCutterObject = (data: Omit<Person, 'id'>) => {
  let names = {
    givenNames: data.givenNames,
    lastName: data.lastName,
    legalName: data.legalName,
  };
  if (data.type === PersonType.JURIDICAL) {
    names = {
      givenNames: undefined,
      lastName: undefined,
      legalName: data.legalName,
    };
  }
  if (data.type === PersonType.NATURAL) {
    names = {
      givenNames: data.givenNames,
      lastName: data.lastName,
      legalName: undefined,
    };
  }

  return names;
};
