export const capitalize = <T extends string>(str: T) => {
  if (!str) return str as Capitalize<T>;
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
};

export const capitalizeWords = <T extends string>(str: T) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") as Capitalize<T>;
};

export const cleanCapitalize = <T extends string>(str: T) => {
  if (!str) return str as Capitalize<T>;
  return str
    .toLowerCase()
    .split(/[\s_]+/) // Splits by both spaces and underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") as Capitalize<T>;
};
