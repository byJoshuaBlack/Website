import type { Access, FieldAccess } from "payload";

export const signedIn: Access = ({ req }) => Boolean(req.user);

export const isAdmin: Access = ({ req }) => req.user?.role === "admin";

export const isAdminField: FieldAccess = ({ req }) => req.user?.role === "admin";

/** Visitors see published documents; anyone signed in to the admin also sees drafts. */
export const publishedOrSignedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: "published" } };
