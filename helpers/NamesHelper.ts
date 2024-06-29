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
  return capitalize(name)?.substring(1, name.length);
}


export {
  formatName,
  capitalize
};
