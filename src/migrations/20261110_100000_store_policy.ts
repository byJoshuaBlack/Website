import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-d1-sqlite";

// A starting store policy at /policies/store, linked from the footer's Company column after Contact.
// The brand edits both in the admin.
const SLUG = "store";
const HREF = `/policies/${SLUG}`;

const p = (text: string) => ({ blockType: "paragraph", text });
const h = (text: string) => ({ blockType: "heading", text });

const body = [
  p(
    "These policies apply to every order placed on byjoshuablack.com. By placing an order, you agree to them. Joshua Black is a Nigerian men's accessories label, registered with the Corporate Affairs Commission under RC 9286208.",
  ),
  h("Ordering"),
  p(
    "Orders are placed on this website only; we do not take orders through Instagram, WhatsApp or direct messages. Your order is confirmed once payment succeeds, and we send a confirmation to the email you gave at checkout.",
  ),
  p("Quantities are limited to the stock we hold. If an item sells out after you have paid, we will tell you and refund you in full."),
  h("Prices and payment"),
  p(
    "Prices are in Nigerian naira (₦). Any delivery fee is shown at checkout before you pay, and the total you see there is the total you pay.",
  ),
  p("Payments are processed securely by Paystack. We never see or store your card details."),
  h("Delivery"),
  p(
    "We deliver within Nigeria only. Orders are usually dispatched within 2 working days of payment. Delivery usually takes 1 to 3 working days in Abuja and 3 to 7 working days elsewhere in Nigeria. These are estimates, not guarantees.",
  ),
  p(
    "Please give an address and a phone number where you can be reached, as our courier may call before delivering. If a delivery fails because the details were wrong or no one was available, we will arrange a second attempt; further attempts may carry a fee.",
  ),
  h("Cancellations"),
  p("You can cancel an order for a full refund until it is dispatched. Email us with your order number."),
  h("Returns and refunds"),
  {
    blockType: "list",
    style: "bullet",
    items: [
      {
        title: "Change of mind",
        text: "You may return unused items in their original box within 7 days of delivery. Return delivery is at your cost.",
      },
      {
        title: "Damaged or wrong items",
        text: "Tell us within 48 hours of delivery, with photos, and we will replace the item or refund you in full, delivery included.",
      },
      {
        title: "Refunds",
        text: "Refunds go back to your original payment method through Paystack within 10 working days of our receiving the return. Your bank may take a few more days to show it.",
      },
    ],
  },
  h("Your personal details"),
  p(
    "We collect your name, email, phone number and delivery address to fulfil your order and to contact you about it. We share them only with Paystack, to take payment, and with our courier, to deliver. We never sell them, and we do not send you marketing without your permission.",
  ),
  p(
    "We keep order records for as long as the law requires for tax and accounting. You may ask to see, correct or delete your details at any time, in line with the Nigeria Data Protection Act 2023.",
  ),
  h("Changes to these policies"),
  p("We may update these policies from time to time. The version on this page when you place an order applies to that order."),
  h("Contact"),
  p(
    "Questions about an order? Email hi@byjoshuablack.com with your order number, or send us a direct message on Instagram at @byjoshuablack.",
  ),
];

type Column = { title: string; links?: { label: string; href: string }[] | null };

async function setFooterLink(payload: MigrateUpArgs["payload"], req: MigrateUpArgs["req"], add: boolean) {
  const navigation = await payload.findGlobal({ slug: "navigation", depth: 0, req });
  const columns = (navigation.footerColumns ?? []) as Column[];
  const company = columns.find((column) => column.title.toLowerCase() === "company") ?? columns[0];
  const without = (column: Column) => (column.links ?? []).filter((link) => link.href !== HREF);
  const footerColumns = add
    ? company
      ? columns.map((column) => (column === company ? { ...column, links: [...without(column), { label: "Policies", href: HREF }] } : column))
      : [{ title: "Company", links: [{ label: "Policies", href: HREF }] }]
    : columns.map((column) => ({ ...column, links: without(column) }));
  await payload.updateGlobal({
    slug: "navigation",
    data: { ...navigation, footerColumns, _status: "published" } as never,
    context: { skipRevalidate: true },
    req,
  });
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const existing = await payload.find({ collection: "policies", where: { slug: { equals: SLUG } }, limit: 1, req });
  if (existing.docs.length === 0) {
    await payload.create({
      collection: "policies",
      data: {
        title: "Policies",
        slug: SLUG,
        summary: "How ordering, payment, delivery, returns and your personal details work when you buy from Joshua Black.",
        body,
        _status: "published",
      } as never,
      context: { skipRevalidate: true },
      req,
    });
  }
  await setFooterLink(payload, req, true);
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.delete({ collection: "policies", where: { slug: { equals: SLUG } }, context: { skipRevalidate: true }, req });
  await setFooterLink(payload, req, false);
}
