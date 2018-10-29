declare namespace ShopListTypes {
  interface Shop {
    authId: number;
    logo: string;
    name: string;
    selected: boolean;
  }

  type Shops = Shop[];
}

export default ShopListTypes;