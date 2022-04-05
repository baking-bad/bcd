const HEX_REGEXP = /^[0-9a-fA-F]+$/;

function isHEX(str) {
  return HEX_REGEXP.test(str);
}