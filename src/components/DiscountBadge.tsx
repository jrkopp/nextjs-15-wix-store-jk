import { products } from "@wix/stores";
import React from "react";
import Badge from "./ui/badge";

interface DiscountBadgeProps {
  data: products.Discount;
}
const DiscountBadge = ({ data }: DiscountBadgeProps) => {
  if (data.type !== "PERCENT") {
    return null;
  }
  return <Badge>-{data.value}%</Badge>;
};

export default DiscountBadge;
