export function toSentenceCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+([a-z])|^[a-z]/g, (s) => s.toUpperCase());
}
