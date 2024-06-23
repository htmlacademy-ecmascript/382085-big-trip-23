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

export function capitalize(text) {
  return `${text[0].toUpperCase()}${text.slice(1)}`;
}

/**
 * @param {import('../framework/observable').default[]} observables
 * @param {Function} cb
 */
export function forkJoinObservables(observables, cb) {
  const state = Array.from(observables, () => 0);
  observables.forEach((observable, idx) => {
    observable.addObserver(makeWaitAllAndCall(idx, state, cb));
  });
}

/**
 * @param {number} idx индекс в массиве state
 * @param {any[]} state массив с результатами
 * @param {Function} cb
 */
function makeWaitAllAndCall(idx, state, cb) {
  return function (updateType) {
    state[idx] = updateType;

    if (state.every((value) => value !== 0)) {
      try {
        if (state.some((value) => value === UpdateType.INIT_FAILED)) {
          cb(UpdateType.INIT_FAILED);
          return;
        }
        cb(UpdateType.INIT);
      } catch (err) {
        throw new Error('In observer callback', err);
      }
    }
  };
}
