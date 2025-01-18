import React from "react";
import { ButtonProps } from "./ui/button";
import { products } from "@wix/stores";
import LoadingButton from "./LoadingButton";
import { useAddItemToCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

const AddToCartButton = ({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) => {
  const mutation = useAddItemToCart();

  return (
    <LoadingButton
      onClick={() => mutation.mutate({ product, selectedOptions, quantity })}
      loading={mutation.isPending}
      className={cn("flex gap-3", className)}
      {...props}
    >
      <ShoppingCartIcon />
      Add to Cart
    </LoadingButton>
  );
};

export default AddToCartButton;
