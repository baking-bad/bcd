export function roundDownSignificantDigits(number, decimals) {
  let significantDigits = (parseInt(number.toExponential().split('e-')[1])) || 0;
  let decimalsUpdated = (decimals || 0) +  significantDigits - 1;
  decimals = Math.min(decimalsUpdated, number.toString().length);

  return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
}

export const SIFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  minimumFractionDigits: 1,
  maximumFractionDigits: 3,
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 3
});