// utils.js
export const estimateReadTime = (text = "") => {
    const wordsPerMinute = 10;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };
  