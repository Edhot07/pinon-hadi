import { wixClient } from "@/lib/wix-client.base";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "../(tabs)";

// Fetch all products
const useFetchProducts = () => {
  return useQuery({
    queryKey: ["wixproducts"],
    queryFn: async () => {
      const productLists = await wixClient.products?.queryProducts().find();
      return productLists.items as Product[];
    },
  });
};

// Fetch single product by ID with cache support
export const useFetchProductById = (id: string) => {
  const queryClient = useQueryClient();

  const cachedProduct = queryClient
    .getQueryData<Product[]>(["wixproducts"])
    ?.find((p) => p._id === id);

  return useQuery({
    queryKey: ["slugProduct", id],
    queryFn: async () => {
      // const productList = await wixClient.products.getProduct(id);
      const productList = await wixClient.products.getProduct(id);
      return productList.product as Product;
    },
    initialData: cachedProduct,
    staleTime: 1000 * 60 * 5,
  });
};

export default useFetchProducts;
