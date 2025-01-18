import React from "react";
import logo from "../assets/logo.png";
import Link from "next/link";
import Image from "next/image";
import { getCart } from "@/wix-api/cart";
import { getWixServerClient } from "@/lib/wix-client.server";
import ShoppingCartButton from "./ShoppingCartButton";

const Navbar = async () => {
  const cart = await getCart(await getWixServerClient());

  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 p-5">
        <Link href="/" className="flex items-center gap-4">
          <Image src={logo} alt="Flow Shop Logo" width={40} height={40} />
          <span className="text-xl font-bold">Flow Shop</span>
        </Link>
        <ShoppingCartButton initialData={cart} />
      </div>
    </header>
  );
};

export default Navbar;
