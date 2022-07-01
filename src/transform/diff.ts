import diff from 'fast-diff';
import { PrimitiveValues } from '../types';

export const diffWraps = (
  val: PrimitiveValues,
  dif: PrimitiveValues,
  addWrap: (v: string) => string,
  rmWrap: (v: string) => string,
): string => {
  if (typeof val === 'string' && typeof dif === 'string') {
    return diff(dif, val)
      .map(([type, str]) => {
        if (type < 0) {
          return rmWrap(str);
        }
        if (type > 0) {
          return addWrap(str);
        }
        return str;
      })
      .join('');
  }
  return val?.toString() || '';
};

export const diffSpans = (val: PrimitiveValues, dif: PrimitiveValues): string =>
  diffWraps(
    val,
    dif,
    s => `<span class="add">${s}</span>`,
    () => '<span class="rm"></span>',
  );
