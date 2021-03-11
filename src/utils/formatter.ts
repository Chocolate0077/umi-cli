/* eslint-disable @typescript-eslint/no-explicit-any */

import numeral from 'numeral';
import { round } from 'lodash-es';
// import moment from 'moment';

/* 获取数值的百分比：100 的占比，number */
export function toHundred(num: number, total: number) {
  if (!num || !total || Number.isNaN(Number(num))) {
    return 0;
  }
  return round((100 * num) / total, 2);
}

/* 可转化为 number 的值的格式化 */
export function formatNumber(str: string | number, format?: string) {
  if (!Number.isNaN(Number(str))) {
    return numeral(str).format(format);
  }
  return str;
}

export function format2Thousand(num: number, defaultNumber = 0) {
  if (!num) return defaultNumber;
  return (
    num &&
    num
      .toString()
      .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  );
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 || 0;
    const v = c === 'x' ? r : (r && 0x3) || 0x8;
    return v.toString(16);
  });
}

// export function formatDate(date: string | moment.Moment) {
//   return moment(date)
//     .utcOffset(0)
//     .format('YYYY-MM-DD HH:mm:ss');
// }

// export function format2ServerDate(
//   startDate: string | moment.Moment,
//   endDate: string | moment.Moment,
// ) {
//   if (!startDate || !endDate) return [undefined, undefined];
//   return [
//     startDate,
//     moment(endDate)
//       .add(1, 'days')
//       .format('YYYY-MM-DD'),
//   ];
// }
