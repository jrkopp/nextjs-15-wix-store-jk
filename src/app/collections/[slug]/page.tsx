import PaginationBar from "@/components/PagintationBar";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionBySlug } from "@/wix-api/collections";
import { queryProducts } from "@/wix-api/products";
import { products } from "@wix/stores";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wixClient = await getWixServerClient();
  const collection = await getCollectionBySlug(wixClient, slug);

  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: banner ? [{ url: banner.url }] : [],
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;
  const wixClient = await getWixServerClient();
  const collection = await getCollectionBySlug(wixClient, slug);

  if (!collection?._id) notFound();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Products</h2>
      <Suspense key={page} fallback={<LoadingSkeleton />}>
        <Products collectionId={collection._id} page={parseInt(page)} />
      </Suspense>
    </div>
  );

  interface ProductProps {
    collectionId: string;
    page: number;
  }

  async function Products({ collectionId, page }: ProductProps) {
    await delay(2000);
    const wixClient = await getWixServerClient();

    const pageSize = 8;

    const collectionProducts = await queryProducts(wixClient, {
      collectionIds: collectionId,
      limit: pageSize,
      skip: (page - 1) * pageSize,
    });

    if (!collectionProducts.length) notFound();

    if (page > (collectionProducts.totalPages || 1)) notFound();

    return (
      <div className="space-y-10">
        <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
          {collectionProducts.items.map((product: products.Product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
        <PaginationBar
          currentPage={page}
          totalPages={collectionProducts.totalPages || 1}
        />
      </div>
    );
  }

  function LoadingSkeleton() {
    return (
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[26rem] w-full" />
        ))}
      </div>
    );
  }
}
