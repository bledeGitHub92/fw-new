import http from '@/utils/http';
import { HOST } from '@/services/config';

export const register = params => http.post(`${HOST}/register`, params, { requestType: 'paramString', });

export const login = params =>
  http.post(`${HOST}/auth/login`, params, {
    requestType: 'paramString',
  });

export const logout = () => http.get(`${HOST}/auth/logout`);

export function getUserInfo () {
  return http.get(`${HOST}/user/info`);
}
