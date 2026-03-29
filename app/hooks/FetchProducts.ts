import { wixClient } from "@/lib/wix-client.base";
import { useQuery } from "@tanstack/react-query";
import { Product } from "../(tabs)";

const useFetchProducts = () => {
  console.log("Fetching products");
  return useQuery({
    queryKey: ["wixproducts"],
    queryFn: async () => {
      const productLists = await wixClient.products?.queryProducts().find();
      return productLists?.items as Product[];
    },
  });
};

export const useFetchProductById = (id: string) => {
  console.log(`Fetching product with id: ${id}`);
  return useQuery({
    queryKey: ["slugProduct", id],
    queryFn: async () => {
      const productList = await wixClient.products.getProduct(id);
      // console.log(
      //   `Fetched product:"\n" ${JSON.stringify(productList, null, 2)}`,
      // );
      const p = productList.product;
      return p;
    },
  });
};

export default useFetchProducts;
