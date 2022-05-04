export function toTitleCase(str) {
  return str.replace(/\p{L}+('\p{L}+)?/gu, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1)
  })
}