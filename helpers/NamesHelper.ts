// Truncates a name if it's too long
const formatName = (name: string | undefined, maxLength: number = 30) => {
  if (!name) {
    return undefined;
  }
  if (name.length > maxLength) {
    return name.substring(0, maxLength - 3) + '...';
  }
  return name;
}


export {
  formatName
};
