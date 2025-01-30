import { wixBrowserClient } from "@/lib/wix-client.browser";
import {
  createProductReviews,
  CreateProductReviewsValues,
} from "@/wix-api/reviews";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export function useCreateProductReview() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: CreateProductReviewsValues) =>
      createProductReviews(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to create review. Please try again.",
      });
    },
  });
}
