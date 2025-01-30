import { WixClient } from "@/lib/wix-client.base";

export async function getOrder(wixClient: WixClient, orderId: string) {
  try {
    return await wixClient.orders.getOrder(orderId);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).details.applicationError.code === "NOT_FOUND") {
      return null;
    } else {
      throw error;
    }
  }
}

interface GetUserOrderFilter {
  limit?: number;
  cursor?: string | null;
}

export async function getUserOrders(
  wixClient: WixClient,
  { limit, cursor }: GetUserOrderFilter,
) {
  return wixClient.orders.searchOrders({
    search: {
      cursorPaging: {
        limit,
        cursor,
      },
    },
  });
}
