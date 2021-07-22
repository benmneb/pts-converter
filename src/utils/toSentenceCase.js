export function toSentenceCase(str) {
  if (['dt', 'pe', 'tha', 'thi', 'ya'].includes(str)) {
    return str;
  }

  return str
    .toLowerCase()
    .replace(/\s+([a-z])|^[a-z]/g, (s) => s.toUpperCase());
}
