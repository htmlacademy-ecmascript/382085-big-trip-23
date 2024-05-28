
export function getRandomArrayElement(anArray) {
  return anArray[Math.floor(Math.random() * anArray.length)];
}

const TIME_DURATION_INTERVALS = [
  {dayjsName: 'day', abbreviation: 'D'},
  {dayjsName: 'hour', abbreviation: 'H'},
  {dayjsName: 'minute', abbreviation:'M'}
];

export function getDurationString(dateFrom, dateTo) {
  let dayjsTo2 = dateTo;
  return Array.from(TIME_DURATION_INTERVALS, (item) => {
    const quantity = dayjsTo2.diff(dateFrom, item.dayjsName);
    dayjsTo2 = dayjsTo2.subtract(quantity, item.dayjsName);
    const formattedQuantity = String(quantity).padStart(2, '0');
    return quantity ? `${formattedQuantity}${item.abbreviation}` : '';
  })
    .join(' ');
}
