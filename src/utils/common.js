
const TIME_DURATION_INTERVALS = [
  {dayjsName: 'day', abbreviation: 'D'},
  {dayjsName: 'hour', abbreviation: 'H'},
  {dayjsName: 'minute', abbreviation:'M'}
];

export function getDurationString(dateFrom, dateTo) {
  let dayjsTo2 = dateTo;
  return Array.from(TIME_DURATION_INTERVALS, ({dayjsName, abbreviation}) => {
    const quantity = dayjsTo2.diff(dateFrom, dayjsName);
    dayjsTo2 = dayjsTo2.subtract(quantity, dayjsName);
    const formattedQuantity = String(quantity).padStart(2, '0');
    return quantity ? `${formattedQuantity}${abbreviation}` : '';
  })
    .join(' ');
}

export function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}
