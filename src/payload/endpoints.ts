import type { Endpoint } from "payload";
import { buildContent, contentHash } from "@/content/build";
import { revalidateSite } from "./revalidate";

/**
 * POST /api/revalidate refreshes the whole site. After a deploy it is called with the hash of the
 * content the build used, and only refreshes if something was published meanwhile. Admins can also
 * call it signed in, for example after rolling back a deploy.
 */
export const revalidateEndpoint: Endpoint = {
  path: "/revalidate",
  method: "post",
  handler: async (req) => {
    const secret = process.env.REVALIDATE_SECRET;
    const fromDeploy = Boolean(secret) && req.headers.get("x-revalidate-secret") === secret;
    if (!fromDeploy && req.user?.role !== "admin") {
      return Response.json({ message: "Not allowed" }, { status: 403 });
    }
    const body = (await req.json?.().catch(() => ({}))) as { hash?: string } | undefined;
    const current = await contentHash(await buildContent(req.payload));
    if (body?.hash && body.hash === current) {
      return Response.json({ refreshed: false, hash: current });
    }
    revalidateSite(req, fromDeploy ? "content changed during the deploy" : "requested by an admin");
    return Response.json({ refreshed: true, hash: current });
  },
};
