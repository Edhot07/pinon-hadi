import { wixClient } from "@/lib/wix-client.base";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "../(tabs)";

// Fetch all products
const useFetchProducts = () => {
  return useQuery({
    queryKey: ["wixproducts"],
    queryFn: async () => {
      const productLists = await wixClient.products?.queryProducts().find();
      return productLists.items;
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
    queryKey: ["id", id],
    queryFn: async () => {
      // const productList = await wixClient.products.getProduct(id);
      const productList = await wixClient.products.getProduct(id);
      return productList.product;
    },
    initialData: cachedProduct,
    staleTime: 1000 * 60 * 5,
  });
};

//Fetch by slug
export const useFetchProductBySlug = (slug: string) => {
  const queryClient = useQueryClient();

  const cachedProduct = queryClient
    .getQueryData<Product[]>(["wixproducts"])
    ?.find((p) => p.slug === slug);

  return useQuery({
    queryKey: ["slug", slug],
    queryFn: async () => {
      const { items } = await wixClient.products
        .queryProducts()
        .eq("slug", slug)
        .limit(1)
        .find();
      const product = items[0];
      if (!product || !product.visible) {
        return;
      }
      return product;
    },
    initialData: cachedProduct,
    staleTime: 1000 * 60 * 5,
  });
};

export default useFetchProducts;
