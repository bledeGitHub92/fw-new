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

export const deimg = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546092990412&di=23d14132bc75f55f96de12b175472885&imgtype=0&src=http%3A%2F%2Fpic.baike.soso.com%2Fp%2F20140506%2F20140506140951-1468290578.jpg';