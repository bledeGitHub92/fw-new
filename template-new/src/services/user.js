import request from '@/utils/request';
import http from '@/utils/http';
import { HOST } from '@/services/config';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}



export const register = (params) => {
  return http.postForm(`${HOST}/register`, params);
}

export const login = (params) =>  {
  return http.post(`${HOST}/auth/login`, params, {
    requestType: 'paramString',
  });
}

export const logout = () => {
  return http.get(`${HOST}/auth/logout`);
}

export const sendSms = (params) =>  {
  return http.get(`${HOST}/user/resetPwd/sendSms`, params);
};

export const resetPassword  = (params) =>  {
  return http.get(`${HOST}/user/resetPwd`, params);
};

export function getUserInfo() {
  return request(`${HOST}/user/info`)
}
