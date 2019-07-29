// https://javascript.programmer-reference.com/js-calculation-age/
export function calculateAge(birthday: Date): number {
  const today = new Date();
  const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
  let age = thisYearBirthday.getFullYear() - birthday.getFullYear();
  if (today < thisYearBirthday) {
    age -= 1;
  }
  return age;
}
