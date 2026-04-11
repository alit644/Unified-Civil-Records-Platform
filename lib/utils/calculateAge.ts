import { differenceInYears, isFuture, isValid } from 'date-fns';

export function calculateAge(dateOfBirth: Date | string | number): number {
  const birthDate = new Date(dateOfBirth);

  if (!isValid(birthDate)) {
    return 0; 
  }

  if (isFuture(birthDate)) {
    return 0; 
  }

  return differenceInYears(new Date(), birthDate);
}