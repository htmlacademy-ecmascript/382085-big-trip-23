import { UpdateType } from '../constants';

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
    return `${formattedQuantity}${abbreviation}`;
  })
    .join(' ');
}

export function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

/**
 * @param {import('../framework/observable').default[]} observables
 * @param {Function} cb
 */
export function myForkJoin(observables, cb) {
  const state = Array.from(observables, () => 0);
  observables.forEach((observable, idx) => {
    observable.addObserver(makeWaitAndCall(idx, cb, state));
  });
}

function makeWaitAndCall(id, cb, state) {
  return function (ev) {
    state[id] = ev;

    if (state.every((v) => v !== 0)) {
      try {
        if (state.some((v) => v === UpdateType.INIT_FAILED)) {
          cb(UpdateType.INIT_FAILED);
          return;
        }
        cb(UpdateType.INIT);
      } catch (err) {
        console.error(err);
      }
    }
  };
}
