import { wixClient } from "@/lib/wix-client.base";
import { categories } from "@wix/categories";
import { products } from "@wix/stores";

export async function getCategories(): Promise<categories.Category[]> {
  const categoryList = await wixClient.categories
    .queryCategories({
      treeReference: {
        appNamespace: "@wix/stores",
      },
    })
    .ne("slug", "all-products") // ← cleaner than filtering after fetch
    .eq("visible", true) // ← filter hidden categories at query level
    .limit(100)
    .find();

  return categoryList.items ?? [];
}

// export async function getCategoryProducts(categoryId: string) {
//   const { products } = await wixClient.productsV3.searchProducts({
//     search: {
//       filter: {
//         "directCategories.id": { $hasSome: [categoryId] },
//       },
//       cursorPaging: { limit: 20 },
//     },
//     fields: ["URL", "THUMBNAIL", "PLAIN_DESCRIPTION"],
//   });

//   return products ?? [];
// }

// export async function getCategoryBySlug(slug: string) {
//   const res = await wixClient.categories.searchCategories(
//     {
//       filter: { slug: { $eq: slug } },
//       cursorPaging: { limit: 1 },
//     },
//     {
//       treeReference: { appNamespace: "@wix/stores", treeKey: null },
//     },
//   );

//   console.log("getCategoryBySlug response:", JSON.stringify(res, null, 2));
//   return res.categories?.[0] ?? null;
// }

// wix-api/categories.ts
// wix-api/categories.ts
export async function getProductsByCategoryId(categoryId: string) {
  try {
    console.log("Fetching products for categoryId:", categoryId);

    const tokens = wixClient.auth.getTokens();
    const accessToken = tokens.accessToken?.value;


    const response = await fetch(
      "https://www.wixapis.com/stores/v3/products/query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // ← Add Bearer prefix ✅
          "wix-site-id": process.env.EXPO_PUBLIC_WIX_SITE_ID!,
        },
        body: JSON.stringify({
          fields: ["DIRECT_CATEGORY_IDS"],
          query: {
            paging: { limit: 100, offset: 0 },
          },
        }),
      },
    );

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
    }

    const result = JSON.parse(text);
    const allProducts = result.products ?? [];
    // ← Filter by categoryId
    const productsInCategory = allProducts.filter((p: any) => {
      const ids =
        p.directCategoryIds ?? p.directCategoryIdsInfo?.categoryIds ?? [];
      return ids.includes(categoryId);
    });

    console.log(
      "Products in category:",
      JSON.stringify(productsInCategory, null, 2),
    );
    return productsInCategory as products.Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// const results = await wixClient.productsV3.searchProducts({
//   search: {

//     filter: {
//       "allCategoriesInfo.categories.id": {
//         $hasSome: [categoryId],
//       },
//     },
//   },
// } as any);

// console.log("Products found:", results?.products?.length ?? 0);
// return results ?? [];
