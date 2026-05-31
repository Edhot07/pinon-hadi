import { useQuery } from "@tanstack/react-query";
import { getCategories, getProductsByCategoryId } from "../wix-api/categories";

export const useFetchCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCategoryProducts = (categoryId: string | null) => {
  return useQuery({
    queryKey: ["categoryProducts", categoryId],
    queryFn: () => getProductsByCategoryId(categoryId!),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
};
