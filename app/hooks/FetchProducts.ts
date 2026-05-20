import toastMessage from "@/lib/toastMessages";
import { wixClient } from "@/lib/wix-client.base";
import { isLoggedIn, saveWixTokens } from "@/lib/wixAuth";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";
import { Image } from "expo-image";
import { Product } from "../(tabs)";
import {
  createBackInStockNotificationRequest,
  CreateBackInStockNotificationRequestValues,
} from "../wix-api/backInStockNotifications";
import getCart, {
  addToCart,
  AddToCartValues,
  removeCartItem,
  updateCartItemQuantity,
  UpdateCartItemQuantityValues,
} from "../wix-api/cart";
import updateMember, {
  getLoggedInMember,
  UpdateMemberValues,
  uploadMemberPhoto,
} from "../wix-api/members";

const queryKey: QueryKey = ["cart"];
const getMemberQueryKey = ["loggedInMember"];
// Fetch all products
const useFetchProducts = () => {
  return useQuery({
    queryKey: ["wixproducts"],
    queryFn: async () => {
      const productLists = await wixClient.products?.queryProducts().find();
      const products = productLists.items;

      Image.prefetch(
        products
          .map((p) => p.media?.mainMedia?.image?.url)
          .filter(Boolean) as string[],
      );
      return products;
    },
    staleTime: 1000 * 60 * 5,
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

// export const useFetchCollectionBySlug = (slug: string) => {
//   return useQuery({
//     queryKey: ["collections", slug],
//     enabled: !!slug,
//     queryFn: async () => {
//       // Step 1 — find category by slug

//       const response = await wixClient.categories.queryCategories({
//         query: {
//           filter: { slug: { $eq: slug } },
//         },
//         treeReference: {
//           appNamespace: "@wix/stores",
//           treeKey: null,
//         },
//         options: {},
//       });
//       console.log("response:", response.categories);
//       return "hi";
//     },
//   });
// };

// export const useCart = (initialData: currentCart.Cart | null) => {
export const useCart = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey,
    queryFn: () => getCart(),
    placeholderData: () => queryClient.getQueryData(["cart"]),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddItemToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: AddToCartValues) => addToCart(values),
    onSuccess: async (data) => {
      await saveWixTokens();
      console.log("Item added to cart");
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, data.cart);
      toastMessage("Item added to cart", "success");
    },
    onError(error) {
      toastMessage("Failed to add item to cart", "error");

      console.log(error);
    },
  });
};

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();

  const mutationKey: MutationKey = ["updateCartItemQuantity"];

  return useMutation({
    mutationKey,
    mutationFn: (values: UpdateCartItemQuantityValues) =>
      updateCartItemQuantity(values),
    onMutate: async ({ productId, newQuantity }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<currentCart.Cart>(queryKey);
      queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.map((lineItem) =>
          lineItem._id === productId
            ? { ...lineItem, quantity: newQuantity }
            : lineItem,
        ),
      }));
      await saveWixTokens();
      return { previousState };
    },
    onError(error, context) {
      console.log("Error updating quantity:", error);
      try {
        //@ts-expect-error
        queryClient.setQueryData(queryKey, context?.previousState);
        toastMessage("Failed to update item quantity", "error");
      } catch (error) {
        console.log(error);
      }
    },
    onSettled() {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey });
        console.log("checking");
      }
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<currentCart.Cart>(queryKey);
      queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.filter(
          (lineItem) => lineItem._id !== productId,
        ),
      }));

      return { previousState };
    },
    onError(error, context) {
      //@ts-expect-error
      queryClient.setQueryData(queryKey, context?.previousState);
      console.log(error, "This is the log");
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey });
      toastMessage("Item removed from cart", "success");
    },
  });
};

export const useCreateBackInStockNotificationRequest = () => {
  return useMutation({
    mutationFn: (values: CreateBackInStockNotificationRequestValues) =>
      createBackInStockNotificationRequest(values),
    onError(error) {
      console.log(error);
      if (
        (error as any).details.applicationError.code ===
        "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS"
      ) {
        alert("You have already requested a notification for this product.");
      } else {
        console.log(error);
        alert(
          "An error occurred while creating the back in stock notification request. Please try again later.",
        );
      }
    },
  });
};

export const useMember = () => {
  return useQuery({
    queryKey: getMemberQueryKey,
    queryFn: getLoggedInMember,
    enabled: isLoggedIn(),
    staleTime: 1000 * 60 * 5, // ← cache for 5 minutes
  });
};

interface UseUpdateMemberArgs {
  memberId: string;
  values: UpdateMemberValues;
  localPhotoUri: string | null;
}
export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      values,
      localPhotoUri,
    }: UseUpdateMemberArgs) => {
      let photoUrl = values.photoUrl;
      console.log(photoUrl);
      console.log(localPhotoUri);

      // ← If user picked a new photo, upload it first
      if (localPhotoUri) {
        try {
          console.log("Starting photo upload...");
          photoUrl = await uploadMemberPhoto(localPhotoUri);
          console.log("Photo upload success:", photoUrl);
        } catch (uploadError) {
          console.log("PHOTO UPLOAD FAILED:", uploadError); // ← is 403 here?
          throw uploadError;
        }
      }
      try {
        console.log("Starting member update...");
        const result = await updateMember(memberId, { ...values, photoUrl });
        console.log("Member update success");
        return result;
      } catch (updateError) {
        console.log("MEMBER UPDATE FAILED:", updateError); // ← or here?
        throw updateError;
      }
    },

    onSuccess: (updatedMember) => {
      // ← Update cache instantly without refetch
      queryClient.setQueryData(getMemberQueryKey, updatedMember);
      console.log("Profile updated ✅");
    },

    onError: (error) => {
      console.log("Update failed:", error);
    },
  });
};

export default useFetchProducts;
