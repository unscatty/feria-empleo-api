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
