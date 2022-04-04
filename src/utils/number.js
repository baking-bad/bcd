export const trauncateFractionAndFormat = (parts, digits) => {
  console.log('parts: ', parts);
  return parts.map(({ type, value }) => {
    if (type !== 'fraction' || !value || value.length < digits) {
      return value;
    }

    let retVal = "";
    for (let idx = 0, counter = 0; idx < value.length && counter < digits; idx++) {
      if (value[idx] !== '0') {
        counter++;
      }
      retVal += value[idx];
    }
    return retVal;
  }).reduce((string, part) => string + part);
};

export const SIFormatter = new Intl.NumberFormat('en', {
  notation: 'compact'
});