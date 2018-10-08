import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

/* from v1 */

/**
 * @RegExp
 * @desc Common RegExp
 */
export const URL_REG = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const PHONE_REG = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

/**
 * @utils
 * @desc types check
 */
export const isString = function (str) {
  return typeof str === 'string'
}

export const isNumber = function (str) {
  return typeof str === 'number'
}

export const isBoolean = function (str) {
  return typeof str === 'boolean'
}

export const isFunction = function (fn) {
  return typeof fn === 'function'
}

export const isObject = function (obj) {
  return obj && typeof obj === 'object'
}

export const isEmptyObject = function (obj) {
  return isObject(obj) && Object.keys(obj).length
}

export const isUndefined = function (any) {
  return typeof any === undefined || any === undefined
}

export const isArray = function (arr) {
  return Array.isArray(arr) || Object.prototype.toString.call(arr) === '[object Array]'
}

export const isArrayLike = function (obj) {
  let length = !!obj && "length" in obj && obj.length

  return isArray(obj) || length === 0 ||
    typeof length === 'number' && length > 0 && (length - 1) in obj
}

export const isUrl = function (str) {
  return URL_REG.test(str);
}

export const isPhoneNumber = function (str) {
  return PHONE_REG.test(str);
}

/**
 * @author Vuchan
 * @desc same implementation like follow link, but more simpler
 * https://www.npmjs.com/package/is-plain-object
 */
export const isPlainObject = function (obj) {
  return isObject(obj) && Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object;
}


/**
 * @utils
 * @desc helpers
 */

/**
 * hasProp
 * @desc 检测对象是否存在改属性
 * @param {Object} obj
 * @param {String} key
 * @param {Boolean} own
 * @returns {Boolean}
 */
export const hasProp = function (obj, key, own) {
  return isObject(obj) && own ? obj.hasOwnProperty(key) : !isUndefined(obj[key])
}

/**
 * when
 * @desc when `fulfilled` so do the next by `then`
 * @param {any*} value
 * @param {Function} fulfilled
 * @param {Function} rejected
 */
export const when = function (value, fulfilled, rejected) {
  var promise = Promise.resolve(value);

  if (arguments.length < 2) {
    return promise;
  }

  return promise.then(fulfilled, rejected);
}

/**
 * inArray
 * @desc To check one `item` in an `array` or not
 * @param {Array} array
 * @param {any*} item
 */
export const inArray = function (array, item) {
  return isArray(array) ? array.includes && array.includes(item) || ~array.indexOf(item) : null
}

/**
 * toArray
 * @desc Make the `arguments` to be an real array
 */
export const toArray = function () {
  return [].slice.call(arguments)
}

/**
 * capitalize
 * @param {String} str
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * before 将函数合并执行，beforeFn先执行，originalFn后执行
 * @author Vuchan
 * @param {*} beforeFn 先执行执行的函数
 * @param {*} originalFn 原函数
 * @param {*} context 上下文this
 * @return any*
 */
export const before = function (originalFn, beforeFn, context) {
  return function () {
    if (beforeFn.apply(context, arguments) === false) return false
    return originalFn.apply(context, arguments)
  }
}

/**
 * after 将函数合并执行，originalFn先执行，afterFn后执行
 * @author Vuchan
 * @param {*} originalFn 原函数
 * @param {*} afterFn 之后执行的函数
 * @param {*} context 上下文this
 * @return any*
 */
export const after = function(originalFn, afterFn, context) {
  return function () {
    let ret = originalFn.apply(context, arguments)
    if (ret === false) return false
    return afterFn.apply(context, arguments)
  }
}

/**
 * @desc 生成指定范围内随机数 int/float [start, end]
 * @author Vuchan
 * @param {Number}  start
 * @param {Number}  end
 * @param {Boolean|Number} len len == 0 => int | len === N => 带 N 位的小数点，若小数点位数大于随机数，则返回当前长度下最大的完整随机数
 * @return {Number}
 */
export const random = (start, end, len = 0) => {
  if (start !== undefined && typeof +start === 'number') {
    const val = end !== undefined && typeof +end === 'number'
      ? Math.random() * (end - start + 1) + start
      : Math.random() * start + 1;
    let [int, double] = `${val}`.split('.')

    if (isNumber(len)) {
      if (len) {
        return +(int + '.' +`${double}`.substr(0, len))
      }
    }

    return +int || parseInt(val, 10)
  }
}

// historical reason
export const geneRandomNum = random;

/**
 * delay 基于Promise的延时调用
 * @author VuChan
 * @param  {Function|Object|Number} fnOrObj
 * @param  {Number} ms=1000
 * @return {Promise}
 */
export function delay(fnOrObj = 1000, ms = 1000) {
  if (typeof fnOrObj === 'number') {
    ms = fnOrObj;
    fnOrObj = null;
  }

  return new Promise((resolve) => {
    const timerId = setTimeout(() => {
      clearTimeout(timerId);
      return resolve(typeof fnOrObj === 'function' ? fnOrObj() : fnOrObj);
    }, ms);
  });
}

/**
 * getMaxValIgnoreSign
 * @author Vuchan
 * @desc 返回所有数中绝对值最大的数（忽略符号）
 * @param  {Number} args
 * @return {Number}
 * @example
 *  getMaxAbsOriVal(-10, 11, -12, 9) // -12
 *  getMaxAbsOriVal(-10.13, 10.12) // -10.13
 */
export const getMaxValIgnoreSign = (...args) => {
  return args.find(t => Math.abs(t) === args.map(t => Math.abs(+t) || 0).sort((a, b) => b - a)[ 0 ] && t);
}

/**
 * getRightEnv
 * @author Vuchan
 * @desc 取得当前正确的运行环境 ['test', 'dev', 'prod' = '']
 * @return {String}
 */
export const getRightEnv = function () {
  const host = window.location.host;

  if (/^test.*\.feewee\.cn/.test(host)) {
    return 'test';
  }

  if (/^dev.*\.feewee\.cn/.test(host)) {
    return 'dev';
  }

  return '';
}

/**
 * classNames
 * @author Vuchan
 * @desc Combine all arguments to be a classList String.
 * @param {Object} any*
 * @example
 *  classNames({ a: 1, b: 0, c: 'c' })
 *  // "a c"
 *  classNames('a', 'b', 'c', { d: 1, e: 0 })
 *  // "a b c d"
 *  classNames('a', 'b', 'c', { d: 1, e: 0 }, {f: 'e'})
 *  // "a b c d f"
 *  classNames('a', 'b', 'c', { d: 1, e: 0 }, {f: 'e'}, ['g', 'h', {'i': '1', 'j': false }])
 *  // "a b c d f g h i"
 *
 * @return {String} classnames string
 */
export const classNames = (...args) => {
  return args.map(t => {
    if (Array.isArray(t)) {
      return t.map(i => classNames(i)).join(' ')
    } else if (typeof t === 'object') {
      return Object.keys(t).filter(k => t[k]).join(' ')
    } else {
      return typeof t !== 'string' ? t.toString() : t
    }
  }).join(' ')
}

/**
 * loadScript
 * @author Vuchan
 * @desc lazy load script form a url
 * @param {String} url
 * @return {Promise}
 */
export const loadScript = function(url) {
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	document.body.appendChild(script);

  return new Promise((resolve) => {
    if (script.readyState) { // IE
      script.onreadystatechange = function change() {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          resolve();
        }
      };
    } else { // Others
      script.onload = function load() {
        resolve();
      };
    }
  });
}

/**
 * checkPropsValue
 * @desc 检查传入对象的属性值，抛出传入的msg或内部默认的错误
 * @author Vuchan
 * @param {Object} obj
 * @param {String} msg
 * @throws Error
 * @return {Boolean}
 */
export const checkPropsValue = (obj, msg) => {
  return Object.keys(obj).reduce((status, key) => {
    if (!obj[key] && obj[key] !== 0) {
      const error = new Error(msg || `${key}'s value is required but it's ${obj[key]}!`);
      error.errorKey = key;

      throw error;
    } else {
      return status = true;
    }
  }, true);
};

/**
 * getQueryString
 * @author VuChan
 * @desc  生成链接后面选项参数
 * @param   {String}  url
 * @param   {Object}  Options
 * @return  {Object | null}
 * @design 穷举法:
 *  0. a.com? | a.com?& | a.com?&=&1=2&&
 *  1. a.com?a=1&b=2&c=&d=3
 *  2. a.com?a=1&b=2&c=&d=3/#/hash
 *  3. a.com/#/hash?a=1&b=2&c=&d=3
 *  4. http://mcar.feewee.cn/uploading.html/#/?shopId=5&orderId=231&loanOrderId=59&orderAmount=64900.00&period=36&downPayRate=0.1
 *  5. http://mcar.feewee.cn/uploading.html?shopId=5&orderId=231&loanOrderId=59&orderAmount=64900.00&period=36&downPayRate=0.1/#/
 *  6. http://devwc.feewee.cn/BindingMobileNumber.html?redirect_url=http%3A%2F%2Fdevwc.feewee.cn%2Factivity%2Fshake.html%3FmktId%3D201805070000008%26subType%3D103
 * @requires
 *  1. 减去 hash 符号提取正常的 url
 *  2. 仅提取正确queryString
 *  3. 如果是 number 则需要转化成 number
 * @example
 *  getQueryString(location.href)
 */
export const getQueryString = (
  url = window.location.href,
  options = {
    cutHash: true, // replace hash `/#/{path}` to be ''
    decoder: decodeURIComponent, // self decoder or browser's
    decodeEach: false,
    all: true, // need all value whatever it is valid or not
    encode: false, // if u need? `false | encodeURLComponent | function`
    placeholder: '', // if value is invalid, so puts the `placeholder`
  },
) => {
  const defaultOptions = {
    cutHash: true, // replace hash `/#/{path}` to be ''
    decoder: decodeURIComponent, // self decoder or browser's
    decodeEach: false,
    all: true, // need all value whatever it is valid or not
    encode: false, // if u need? `false | encodeURLComponent | function`
    placeholder: '', // if value is invalid, so puts the `placeholder`
  };

  options = { ...defaultOptions, ...options };

  const parse = str => {
    if (!str || !str.trim().length) return null;
    else {
      if (
        !~str.indexOf('?') &&
        (~str.indexOf('=') &&
        ~str.indexOf('&'))
      ) {
        str = str.split('&').map(t => t.trim()).filter(t => ~t.indexOf('=')).map(t => (options.decodeEach ? options.decoder(t) : t));
      } else {
        str = [str];
      }

      if (str.length) {
        return str.reduce((r, c) => {
          c = c.split('=');
          if (c.length > 2) c = [c.shift(), c.join('=')];

          if (c[0]) {
            if (c[1]) {
              r[c[0]] = +c[1] ? +c[1] : c[1];
            } else {
              r[c[0]] = options.placeholder;
            }
          }

          return r;
        }, {});
      } else {
        return null;
      }
    }
  };

  let str = !options.decodeEach && typeof options.decoder === 'function' ? options.decoder(url) : url;

  // type check of str value
  if (!str || typeof str !== 'string' || !str.trim()) return null;
  if (options.cutHash) {
    // match this format like -> /#/ | /#/{word}
    str = str.replace(/\/?\#\/(\w*\b)?/, '');
  }

  if (~str.indexOf('?')) {
    // splits `?` only once
    str = str.split('?');
    if (str.length > 2) {
      str = [str.shift(), str.join('?')];
    }

    str = str[1];
  } else {
    // if no any `?` sign returns null
    return null
  }

  return parse(str);
};

// historical reason
export const getSearchParams = getQueryString;
