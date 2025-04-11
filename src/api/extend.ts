export const extend: any = (dest: any, ...sources: any[]) => {
  const obj = sources[0];
  for (let property in obj) {
    if (obj[property]) {
      dest[property] = obj[property];
    }
  }

  if (sources.length > 1) {
    return extend(dest, ...sources.splice(1, sources.length - 1));
  }
  return dest;
};
