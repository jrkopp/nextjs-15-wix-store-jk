import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import { useMutation } from "@tanstack/react-query";
import { updateMemberInfo, UpdateMemberInfoValues } from "@/wix-api/members";
import { wixBrowserClient } from "@/lib/wix-client.browser";

export function useUpdateMemberInfo() {
  const { toast } = useToast();

  const router = useRouter();

  return useMutation({
    mutationFn: (variables: UpdateMemberInfoValues) =>
      updateMemberInfo(wixBrowserClient, variables),
    onSuccess() {
      toast({
        description: "Profile updated",
      });
      setTimeout(() => {
        router.refresh();
      }, 2000);
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Failed to update profile. Please try again",
        variant: "destructive",
      });
    },
  });
}
