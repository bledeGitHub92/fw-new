import { checkAuthority } from '@/utils/routerUtils';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  console.log(checkAuthority());
  return checkAuthority() ? ['admin'] : ['guest'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
