import http from '@/utils/http';
import { HOST } from '@/services/config';

/* 获取菜单 */
export async function getMenusInfo() {
  return http.get(`${HOST}/menu/getUserMenu`);
}

/* 用户身份列表 */
export function getIdentityList() {
  return http.get(`${HOST}/user/psmList`);
}
