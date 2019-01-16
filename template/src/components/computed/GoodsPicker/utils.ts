// @ts-ignore
import _default from './images/default.png';

/**
 * 通过唯一的key值判断某项元素中是否存在数组中
 */
export function includes<T>(data: T[], target: T, key?: string): boolean {
  let _key = key || 'key';
  let isExit = false;
  data.forEach(item => {
    if (item[_key] === target[_key]) {
      isExit = true;
    }
  });

  return isExit;
}

/** 去重 */
export function deRepetition<T>(data: T[], key?: string): T[] {
  let _key = key || 'key';
  let res = [];

  data.forEach(item => {
    if (!includes(res, item, _key)) {
      res.push(item);
    }
  });

  return res;
}

export const deimg = _default;