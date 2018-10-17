import http from '@/utils/http';
import { HOST } from '@/services/config';

export const register = params => http.postForm(`${HOST}/register`, params);

export const login = params =>
  http.post(`${HOST}/auth/login`, params, {
    requestType: 'paramString',
  });

export const logout = () => http.get(`${HOST}/auth/logout`);

export function getUserInfo() {
  return http.get(`${HOST}/user/info`);
}
