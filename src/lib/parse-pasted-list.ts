export const parsePastedList = (text: string): string[] => {
  if (!text) return [];
  
  // Split by commas, semicolons, and newlines
  const rawTokens = text.split(/[,;\n\r]+/);
  const stopWords = new Set(["and", "or", "the", "in", "of", "from", "to", "with", "a", "an", "&"]);
  
  const parsed: string[] = [];
  
  for (const token of rawTokens) {
    let cleaned = token.trim();
    
    // Remove leading/trailing common punctuation (like periods, quotes, brackets etc.)
    // but keep letters, numbers, spaces, and round brackets in the middle
    cleaned = cleaned.replace(/^[.,;:*"'`“‘’”[\](){}<>!\s]+|[.,;:*"'`“‘’”[\](){}<>!\s]+$/g, "");
    
    // Strip leading noise words and operators like "and ", "or ", "as well as ", "& "
    cleaned = cleaned.replace(/^(and|or|&|as well as)\s+/i, "");
    
    cleaned = cleaned.trim();
    
    if (!cleaned) continue;
    
    // If the token is a single stop word itself, skip it
    if (stopWords.has(cleaned.toLowerCase())) {
      continue;
    }
    
    parsed.push(cleaned);
  }
  
  return parsed;
};
