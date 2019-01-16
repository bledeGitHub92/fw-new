declare namespace goods {
  interface Goods {
    skuId: number,
    goodsName: string,
    goodsImg: string,
    price: number,
    number?: number,
    materielCode: string
  }

  interface Param {
    keyWord?: string,
    /** 物料代码 */
    materielCode?: string,
    current?: number,
    pageSize?: number
  }
}