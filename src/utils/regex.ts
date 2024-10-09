export const sanitizeResponse = (text: string) => {
  // Regular expression to match any text within 【 and 】
  const bracketPattern = /【[^】]*】/g;
  // Replace any matched pattern with an empty string
  return text.replace(bracketPattern, "");
};
