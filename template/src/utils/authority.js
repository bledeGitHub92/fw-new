import { checkAuthority } from '@/utils/routerUtils';

/**
 * 根据 cookie 返回权限
 */
export default function getAuthority() {
  return checkAuthority() ? ['admin'] : ['guest'];
}
