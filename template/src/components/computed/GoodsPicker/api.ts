import http from '@/utils/http';
import iHttp from '@/utils/http/request';
import host from '@/utils/host';

/**
 * 查询优惠券分组
 */
export function goodsApi(param: goods.Param = {}): iHttp.PromisePageResp<goods.Goods> {
  return http.get(`${host.promotion}/erp/common/wareSearch`, {
    params: param
  });
}
