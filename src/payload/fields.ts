import type { ArrayField, Field, GroupField, TextField, TextareaField } from "payload";

type Options = { label?: string; description?: string; required?: boolean };

/** A photo as used in one place: the picture, an optional alt override and an optional crop. */
export function image(name: string, options: Options & { adminOnly?: boolean } = {}): GroupField {
  return {
    name,
    label: options.label,
    type: "group",
    admin: { description: options.description },
    access: options.adminOnly ? { update: ({ req }) => req.user?.role === "admin" } : undefined,
    fields: [
      { name: "image", type: "upload", relationTo: "media", required: options.required ?? true },
      {
        name: "alt",
        type: "text",
        admin: { description: "Leave empty to use the photo's own description." },
      },
      {
        name: "crop",
        type: "group",
        admin: {
          description:
            "Optional. x and y are the point to keep in view, in percent of the photo's width and height (0 to 100).",
        },
        fields: [
          {
            type: "row",
            fields: [
              { name: "x", type: "number", min: 0, max: 100, validate: cropPair },
              { name: "y", type: "number", min: 0, max: 100, validate: cropPair },
              { name: "zoom", type: "number", min: 1, max: 2, admin: { description: "1 to 2. Needs x and y." } },
              {
                name: "top",
                type: "number",
                min: 0,
                max: 100,
                admin: { description: "Trim above the subject, in percent. Replaces y." },
              },
            ],
          },
        ],
      },
    ],
  };
}

function cropPair(value: number | null | undefined, { siblingData }: { siblingData: Record<string, unknown> }) {
  const set = (field: unknown) => typeof field === "number";
  const any = ["x", "y", "zoom", "top"].some((field) => set(siblingData[field]));
  if (any && !set(value)) return "Set both x and y when using a crop.";
  return true;
}

export function images(name: string, options: Options & { minRows?: number } = {}): ArrayField {
  return {
    name,
    label: options.label,
    type: "array",
    minRows: options.minRows ?? 1,
    admin: { description: options.description },
    fields: image("photo").fields,
  };
}

export function link(name: string, options: Options = {}): GroupField {
  return {
    name,
    label: options.label,
    type: "group",
    admin: { description: options.description },
    fields: [
      {
        type: "row",
        fields: [
          { name: "label", type: "text", required: true },
          {
            name: "href",
            label: "Link",
            type: "text",
            required: true,
            admin: { description: "A page on this site, like /collection, or a full address." },
          },
        ],
      },
    ],
  };
}

export function links(name: string, options: Options & { minRows?: number; maxRows?: number } = {}): ArrayField {
  return {
    name,
    label: options.label,
    type: "array",
    minRows: options.minRows,
    maxRows: options.maxRows,
    admin: { description: options.description },
    fields: link("link").fields,
  };
}

/** A list of plain lines or paragraphs, stored as rows of `line` so editors can reorder them. */
export function lines(
  name: string,
  options: Options & { minRows?: number; maxRows?: number; long?: boolean; maxLength?: number } = {},
): ArrayField {
  const text: TextField | TextareaField = options.long
    ? { name: "line", label: "Paragraph", type: "textarea", required: true, maxLength: options.maxLength }
    : { name: "line", type: "text", required: true, maxLength: options.maxLength };
  return {
    name,
    label: options.label,
    type: "array",
    minRows: options.minRows,
    maxRows: options.maxRows,
    admin: { description: options.description },
    fields: [text],
  };
}

/** Phrases in a headline picked out in a brand colour; each must appear in the field named `of`. */
export function accents(of: string): ArrayField {
  return {
    name: "accents",
    type: "array",
    admin: { description: "Phrases from the headline shown in pine or bronze. Each must appear in the headline exactly." },
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "text",
            type: "text",
            required: true,
            validate: (value: string | null | undefined, { data, path }: { data: unknown; path: (string | number)[] }) => {
              const headline = headlineAt(data, path, of);
              if (value && headline !== undefined && !headline.includes(value)) {
                return `"${value}" does not appear in the headline.`;
              }
              return true;
            },
          },
          {
            name: "tone",
            type: "select",
            required: true,
            defaultValue: "bronze",
            options: [
              { label: "Pine", value: "pine" },
              { label: "Bronze", value: "bronze" },
            ],
          },
        ],
      },
    ],
  };
}

// Finds the sibling headline of the accents array this row belongs to.
function headlineAt(data: unknown, path: (string | number)[], of: string): string | undefined {
  const parentPath = path.slice(0, path.lastIndexOf("accents"));
  let node: unknown = data;
  for (const key of parentPath) node = (node as Record<string | number, unknown> | undefined)?.[key];
  const headline = (node as Record<string, unknown> | undefined)?.[of];
  return typeof headline === "string" ? headline : undefined;
}

/** A single word or phrase from a list of lines that is drawn in a script accent. */
export function highlight(description = "One word from the lines above, drawn larger."): Field {
  return { name: "highlight", type: "text", required: true, admin: { description } };
}
