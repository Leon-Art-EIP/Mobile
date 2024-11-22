// Uppercases the first letter of a string (useful for names)
const capitalize = (name: string | undefined) => {
  if (!name) {
    return name;
  }

  return name[0].toUpperCase() + name.substring(1, name.length);
}


// Truncates a name if it's too long
const formatName = (name: string | undefined, maxLength: number = 30) => {
  if (!name) {
    return undefined;
  }

  if (name.length > maxLength) {
     return capitalize(name)?.substring(0, maxLength - 4) + '...';
  }
  return capitalize(name)?.substring(0, name.length);
}


// Returns true if the STR length is between or equal to MIN and MAX
// Returns false by default and in case of error
const betwStr = (
  min: number = 0,
  str: string | undefined = undefined,
  max: number = 100
): boolean => {
  if (isNaN(min) || isNaN(max) || !str) {
    return false;
  }

  return (min <= str.length && str.length <= max);
}


// Returns true if VALUE is between or equal to MIN and MAX
// Returns false by default and in case of error
const betw = (
  min: number = 0,
  value: number = -1,
  max: number = 100
): boolean => {
  if (isNaN(min) || isNaN(value) || isNaN(max)) {
    return false;
  }

  return (min <= value && value <= max);
}


// Returns true if STR contains only letters, numbers or underscores
// Returns false otherwise and in case of error
const isAlphaNumeric = (str: string | undefined = undefined): boolean => {
  if (!str) {
    return false;
  }

  const regex = /^[A-Za-z0-9_]+$/;
  return !!regex.test(str);
}


// Returns true if STR has at least one uppercase letter
// Returns false otherwise and in case of error
const hasUppercase = (str: string | undefined = undefined): boolean => {
  if (!str) {
    return false;
  }

  const hasUppercaseRegex = /[A-Z]/;
  return !!hasUppercaseRegex.test(str);
}


// Returns true if STR has at least one uppercase letter
// Returns false otherwise and in case of error
const hasNumbers = (str: string | undefined = undefined): boolean => {
  if (!str) {
    return false;
  }

  const hasNumbersRegex = /[0-9]/;
  return !!hasNumbersRegex.test(str);
}


export {
  formatName,
  capitalize,
  betw,
  betwStr,
  isAlphaNumeric,
  hasUppercase,
  hasNumbers
};
