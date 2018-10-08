/**
 * Provide `getter` & `setter` to operate cookies
 */
let cookieCacheStr = '';
let cookie = {};

export const has = hasCookie;
export const get = getCookie;
export const set = setCookie;
export const del = delCookie;
export default {
  get all() {
    return getCookie();
  },
  get,
  has,
  set,
  del,
}


/**
 * getter
 * @param {String} name
 * @Cacheable
 * @return {null | string | object}
 */
export function getCookie(name) {
  if (cookieCacheStr !== document.cookie) {
    cookie = {};

    document.cookie.split(';').forEach(t => {
      const [key, value] = t.split('=');
      cookie[key.replace(/\s/g, '')] = value;
    });

    cookieCacheStr = document.cookie;
  }

  return name ? cookie[name] : cookie;
}

export function hasCookie(key) { return !!get(key) };

/**
 * setCookie
 * @setter
 * @param {String} key
 * @param {String} val
 * @param {String} domain
 * @param {String} path
 * @param {GMTDateTime} expiresTime
 */
export function setCookie(key, val, domain, path, expiresTime) {
  document.cookie = key + '=' + val +
    ((domain) ? ';domain=' + domain : '') +
    ((path) ? ';path=' + path : '') +
    `;expires=${(
      expiresTime
      ? expiresTime instanceof Date
        ? expiresTime
        : new Date(expiresTime).toGMTString()
      : 'Thu, 01 Jan 1970 00:00:01 GMT')}`;

  return hasCookie(key);
}

export function delCookie(key)  {
  const url = new URL(window.location.href);
  // a.b.cn => [a.b.cn, b.cn]
  const paths = url.hostname.split('.');
  const domains = [];

  // cause the last one of paths always is `cn/com/org/other...`.
  while(paths.length > 1) {
    domains.push(paths.join('.'))
    paths.shift()
  }

  // loop to delete all cookie in domains one by one
  domains.forEach(domain => {
    setCookie(key, '', domain, '/');
  })

  return !hasCookie(key);
};
