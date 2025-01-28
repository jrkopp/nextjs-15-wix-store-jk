import { WixClient } from "@/lib/wix-client.base";
import { members } from "@wix/members";
import { cache } from "react";

export const getLoggedInMember = cache(
  async (wixClient: WixClient): Promise<members.Member | null> => {
    // Check if wixClient and auth are defined
    if (!wixClient || !wixClient.auth) {
      console.error("WixClient or auth is not initialized");
      return null;
    }

    // Ensure loggedIn is a function before calling it
    if (typeof wixClient.auth.loggedIn !== "function") {
      console.error("WixClient auth.loggedIn is not a function");
      return null;
    }

    try {
      wixClient.auth.loggedIn();
    } catch (error) {
      console.error("Error getting logged in member", error);
      return null;
    }
    if (!wixClient.auth.loggedIn()) {
      return null;
    }

    const memberData = await wixClient.members.getCurrentMember({
      fieldsets: [members.Set.FULL],
    });

    return memberData.member || null;
  },
);

export interface UpdateMemberInfoValues {
  firstName: string;
  lastName: string;
}

export async function updateMemberInfo(
  wixClient: WixClient,
  { firstName, lastName }: UpdateMemberInfoValues,
) {
  const loggedInMember = await getLoggedInMember(wixClient);

  if (!loggedInMember?._id) {
    throw Error("No member ID found");
  }

  return wixClient.members.updateMember(loggedInMember._id, {
    contact: {
      firstName,
      lastName,
    },
  });
}
