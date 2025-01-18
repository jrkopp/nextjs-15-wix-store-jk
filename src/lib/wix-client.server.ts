import { Tokens } from "@wix/sdk";
import { WIX_SESSION_COOKIE } from "./constants";
import { cookies } from "next/headers";
import { getWixClient } from "./wix-client.base";
import { cache } from "react";

export const getWixServerClient = cache(async () => {
  let tokens: Tokens | undefined;

  try {
    const cookieStore = await cookies();
    tokens = JSON.parse(cookieStore.get(WIX_SESSION_COOKIE)?.value || "{}");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {}

  return getWixClient(tokens);
});
