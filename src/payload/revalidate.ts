import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from "payload";

// Every page shares the layout's search index, settings and navigation, so any published change
// expires the whole site. Pages re-render on their next visit.
export function revalidateSite(req: PayloadRequest, reason: string) {
  if (req.context?.skipRevalidate) return;
  try {
    revalidatePath("/", "layout");
    req.payload.logger.info({ msg: `Refreshed the site: ${reason}` });
  } catch (error) {
    // Outside a request (migrations, scripts) Next has nowhere to record the revalidation.
    req.payload.logger.warn({ msg: `Could not refresh the site: ${reason}`, err: error });
  }
}

type Versioned = { id: number | string; _status?: "draft" | "published" | null };

export const revalidateOnPublish: CollectionAfterChangeHook<Versioned> = ({ doc, previousDoc, req, collection }) => {
  const published = doc._status === "published";
  const unpublished = previousDoc?._status === "published" && doc._status !== "published";
  if (published || unpublished || !("_status" in doc)) revalidateSite(req, `${collection.slug} changed`);
  return doc;
};

export const revalidateOnDelete: CollectionAfterDeleteHook = ({ req, collection }) => {
  revalidateSite(req, `${collection.slug} deleted`);
};

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req, global }) => {
  const status = (doc as Versioned)._status;
  if (status === undefined || status === null || status === "published") revalidateSite(req, `${global.slug} changed`);
  return doc;
};
