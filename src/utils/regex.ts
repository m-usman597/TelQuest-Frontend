export const sanitizeResponse = (text: string) => {
  // Regular expression to match patterns like
  const sourcePattern = /【\d+:\d+†source】/g;
  // Replace any matched pattern with an empty string
  return text.replace(sourcePattern, "");
};
