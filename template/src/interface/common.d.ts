import { History } from 'history';
import { match, RouteProps } from 'dva/router';

declare namespace common {
  interface Action<T> {
    type: string,
    payload?: T,
    success?: (val?: any) => any,
    error?: (val?: any) => any,
    [key: string]: any
  }
  
  interface Params {
    [key: string]: any
  }

  interface ConnectProps {
    dispatch: (action: Action<any>) => Promise<any>,
    history: History,
    location: Location,
    match: match<Params>,
    route: RouteProps,
    staticContext: any
  }

  interface Pagination {
    current: number,
    pageSize: number,
    total: number,
    lastPage?: boolean
  }

  interface PaginationDateset<T> {
    list: T[],
    pagination: Pagination
  }

  interface Page<T> {
    /**
     * 当前页
     */
    current: number,

    /**
     * 当前页
     */
    currentPage: number,
    data: T[],

    /**
     * 当前页的最后一项
     */
    endIndex: number,

    /**
     * 当前页的第一项
     */
    startIndex: number,
    extInfo: string,

    /**
     * 是否是最后一项
     * 
     * 默认值： false
     */
    lastPage: boolean,

    /**
     * 下一页
     */
    nextPage: number,

    /**
     * 上一页
     */
    previousPage: number,

    pageSize: number,

    /**
     * 总页数
     */
    totle: number,

    /**
     * 单位
     * 
     * 默认：条
     */
    unit: string
  }

  interface EffectsMap {
    /**
     * put 返回值大概如下
     * {
        '@@redux-saga/IO': true,
        'cars/query': payload
      }
     */
    put: <T>(action: Action<T>) => Object,
    call: (apiFunc: Function, Params: any) => any
    select: Function,
    take: Function,
    cancel: Function,
    [key: string]: any,
  }
}