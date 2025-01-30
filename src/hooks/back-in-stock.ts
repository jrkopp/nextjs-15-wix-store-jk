import { wixBrowserClient } from "@/lib/wix-client.browser";
import { useToast } from "./use-toast";
import {
  BackInStockNotificationRequestValues,
  createBackInStockNotificationRequest,
} from "@/wix-api/backinStockNotifications";
import { useMutation } from "@tanstack/react-query";

export function useCreateBackInStockNotificationRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: BackInStockNotificationRequestValues) =>
      createBackInStockNotificationRequest(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).details.applicationError.code ===
        "BACK_IN_STOCK_NOTIFICATION_ALREADY_EXISTS"
      ) {
        toast({
          variant: "destructive",
          description: "error",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong.  Please try again.",
        });
      }
    },
  });
}
