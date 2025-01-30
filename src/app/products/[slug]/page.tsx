import { getProductBySlug, getRelatedProducts } from "@/wix-api/products";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { getWixServerClient } from "@/lib/wix-client.server";
import { products } from "@wix/stores";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoggedInMember } from "@/wix-api/members";
import CreateProductReviewButton from "@/components/reviews/CreateProductReviewButton";
import ProductReviews, { ProductReviewsLoadingSkeleton } from "./ProductReview";
import { getProductReviews } from "@/wix-api/reviews";

export interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProductBySlug(await getWixServerClient(), slug);

  if (!product) notFound();

  const mainImage = product.media?.mainMedia?.image;

  return {
    title: product.name,
    description: "Get this product on Flow Shop",
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText || "",
            },
          ]
        : undefined,
    },
  };
}

const Page = async ({ params }: PageProps) => {
  const slug = (await params).slug;

  const product = await getProductBySlug(await getWixServerClient(), slug);

  if (!product?._id) notFound();

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-5 py-10">
      <ProductDetails product={product} />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
      <hr />
      <div className="space-y-5">
        <h2 className="text-2xl font-bold">Buyer Reviews</h2>
        <Suspense fallback={<ProductReviewsLoadingSkeleton />}>
          <ProductReviewsSection product={product} />
        </Suspense>
      </div>
      <hr />
    </main>
  );
};

export default Page;

interface RelatedProductsProps {
  productId: string;
}

async function RelatedProducts({ productId }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(
    await getWixServerClient(),
    productId,
  );

  if (!relatedProducts.length) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid lg:grid-cols-4">
        {relatedProducts.map((product: products.Product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductsLoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 pt-12 sm:grid lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-[26rem} w-full" />
      ))}
    </div>
  );
}

interface ProductReviewsSectionProps {
  product: products.Product;
}

async function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  if (!product._id) return null;

  const wixClient = await getWixServerClient();

  const loggedInMember = await getLoggedInMember(wixClient);

  const existingReview = loggedInMember?.contactId
    ? (
        await getProductReviews(wixClient, {
          productId: product._id,
          contactId: loggedInMember.contactId,
        })
      ).items[0]
    : null;

  return (
    <div className="space-y-5">
      <CreateProductReviewButton
        product={product}
        loggedInMember={loggedInMember}
        hasExistingReview={!!existingReview}
      />
      <ProductReviews product={product} />
    </div>
  );
}
