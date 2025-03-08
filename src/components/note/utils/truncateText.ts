export const truncateText = (text: any, maxLength: any) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "…";
};