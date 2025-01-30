import { getWixServerClient } from "@/lib/wix-client.server";
import { getProductById } from "@/wix-api/products";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;

  if (id === "someId") {
    redirect(
      `/products/i-m-a-product-1${new URLSearchParams(searchParams).toString()}`,
    );
  }

  const product = await getProductById(await getWixServerClient(), id);

  if (!product) notFound();

  redirect(
    `/products/${product.slug}?${new URLSearchParams(searchParams).toString()}`,
  );
}
