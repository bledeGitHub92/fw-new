import http from '@/utils/http';
import { HOST } from '@/services/config';

/* 获取菜单 */
export async function getMenusInfo() {
  return http.get(`${HOST}/menu/getUserMenu`);
}

/* 获取商铺列表 */
export function getShopInfo() {
  return http.get(`${HOST}/user/authList`);
}

/**
 * 用户手动切换商家
 * @param {Object} params
 * @props {Int} shopId
 */
export function switchUserShop(params) {
  return http.get(`${HOST}/auth/switchUserShop?shopId=${params.shopId}`);
}
