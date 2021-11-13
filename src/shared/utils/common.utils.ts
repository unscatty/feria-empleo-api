export const getSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
    .replace(/[\u0300-\u036f]/g, '');
};

export const removeEmptyValues = <T = any>(obj: T) => {
  Object.keys(obj).forEach((key) => {
    if (Array.isArray(obj[key])) {
      obj[key].forEach(removeEmptyValues);
    } else if (typeof obj[key] === 'object' && !Buffer.isBuffer(obj[key])) {
      obj[key] = removeEmptyValues(obj[key]);
    } else if (obj[key] === undefined) {
      delete obj[key];
    }
  });

  return obj;
};
