import { getWixAdminClient } from "@/lib/wix-client.server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get("fileName");
  const mimeType = req.nextUrl.searchParams.get("mimeType");

  if (!fileName || !mimeType) {
    return new Response("Missing required query parameters", {
      status: 400,
    });
  }

  const client = await getWixAdminClient();
  const { uploadUrl } = await client.files.generateFileUploadUrl(mimeType, {
    fileName,
    filePath: "product-review-media",
    private: false,
  });

  return Response.json({ uploadUrl });
}
