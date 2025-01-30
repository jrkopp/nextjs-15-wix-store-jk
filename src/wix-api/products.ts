import { WIX_STORES_APP_ID } from "@/lib/constants";
import { WixClient } from "@/lib/wix-client.base";
import { cache } from "react";

export type ProductsSort = "last_updated" | "price_asc" | "price_desc";

interface QueryProductsFilter {
  q?: string;
  collectionIds?: string[] | string;
  sort?: ProductsSort;
  priceMin?: number;
  priceMax?: number;
  skip?: number;
  limit?: number;
}

export async function queryProducts(
  wixClient: WixClient,
  {
    q,
    collectionIds,
    sort = "last_updated",
    priceMin,
    priceMax,
    skip,
    limit,
  }: QueryProductsFilter,
) {
  const collectionIdsArray = collectionIds
    ? typeof collectionIds === "string"
      ? [collectionIds]
      : collectionIds
    : [];

  let query = wixClient.products.queryProducts();

  if (q) {
    query = query.startsWith("name", q);
  }

  if (collectionIdsArray.length > 0) {
    query = query.hasSome("collectionIds", collectionIdsArray);
  }

  switch (sort) {
    case "last_updated":
      query = query.descending("lastUpdated");
      break;
    case "price_asc":
      query = query.ascending("price");
      break;
    case "price_desc":
      query = query.descending("price");
      break;
  }

  if (priceMin) query = query.ge("priceData.price", priceMin);
  if (priceMax) query = query.le("priceData.price", priceMax);

  if (limit) query = query.limit(limit);
  if (skip) query = query.skip(skip);

  return query.find();
}

export const getProductBySlug = cache(
  async (wixClient: WixClient, slug: string) => {
    const { items } = await wixClient.products
      .queryProducts()
      .eq("slug", slug)
      .limit(1)
      .find();

    const product = items[0];

    if (!product || !product.visible) {
      return null;
    }
    return product;
  },
);

export async function getProductById(wixClient: WixClient, productId: string) {
  const results = await wixClient.products.getProduct(productId);
  return results.product;
}

export async function getRelatedProducts(
  wixClient: WixClient,
  productId: string,
) {
  const result = await wixClient.recommendations.getRecommendation(
    [
      {
        _id: "68ebce04-b96a-4c52-9329-08fc9d8c1253", // "from the same categories"
        appId: WIX_STORES_APP_ID,
      },
      {
        _id: "ba491fd2-b172-4552-9ea6-7202e01d1d3c", // "best sellers"
        appId: WIX_STORES_APP_ID,
      },
    ],
    {
      items: [
        {
          appId: WIX_STORES_APP_ID,
          catalogItemId: productId,
        },
      ],
      minimumRecommendedItems: 4,
    },
  );

  const productIds = result.recommendation?.items
    .map((item) => item.catalogItemId)
    .filter((id) => id !== undefined);

  if (!productIds || !productIds.length) return [];

  const productsResult = await wixClient.products
    .queryProducts()
    .in("_id", productIds)
    .limit(4)
    .find();

  return productsResult.items;
}
