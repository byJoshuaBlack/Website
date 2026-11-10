import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-d1-sqlite";

// Starting values for the shop: closed, the box at ₦300,000 with delivery included (both zones at
// ₦0), the checkout's interface copy, and a stock row for the box. The brand edits it all in the admin.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const context = { skipRevalidate: true };

  await payload.updateGlobal({
    slug: "shopSettings",
    data: {
      status: "closed",
      maxPerOrder: 5,
      alertEmail: "hi@byjoshuablack.com",
      zones: [
        { name: "Abuja", fee: 0, everywhereElse: false, states: ["Federal Capital Territory (Abuja)"] },
        { name: "Rest of Nigeria", fee: 0, everywhereElse: true, states: [] },
      ],
    },
    context,
    req,
  });

  await payload.updateGlobal({
    slug: "checkout",
    data: {
      _status: "published",
      cart: {
        proceed: "Proceed to Checkout",
        title: "Checkout",
        payLabel: "Pay now",
        intro: "Pocket Power, delivered to your door.",
        empty: "Your cart is empty.",
        continueShopping: "Continue shopping",
        remove: "Remove",
        quantityLabel: "Quantity",
        detailsTitle: "Delivery details",
        priceNote: "Delivery included",
        soldOut: "Pocket Power is sold out for now.",
        closed: "Our online store opens soon.",
      },
      form: {
        firstNameLabel: "First name",
        lastNameLabel: "Last name",
        countryCodeLabel: "Country code",
        emailInvalid: "This email doesn't look right. Please check it.",
        phoneInvalid: "This phone number doesn't look right for the country chosen.",
        emailLabel: "Email",
        phoneLabel: "Phone number",
        addressLabel: "Delivery address",
        cityLabel: "City or town",
        stateLabel: "State",
        subtotalLabel: "Subtotal",
        deliveryLabel: "Delivery",
        deliveryIncluded: "Included",
        totalLabel: "Total",
        agreement: "I have read and agree to the",
      },
      complete: {
        paidTitle: "Thank you",
        paidText: "Your order is confirmed. We will email you when it is on its way.",
        failedTitle: "Payment not completed",
        failedText: "Your payment did not go through, and you have not been charged. You can try again.",
        pendingTitle: "Confirming your payment",
        pendingText: "Paystack is still confirming your payment. We will email you as soon as it clears; there is no need to pay again.",
        retryLabel: "Try again",
      },
      email: {
        subject: "Your Joshua Black order",
        intro: "Thank you for your order. Here is what you bought and where it is going.",
        closing: "We will email you again when your order is on its way. Reply to this email with any question.",
      },
    },
    context,
    req,
  });

  const { docs } = await payload.find({ collection: "products", where: { kind: { equals: "set" } }, limit: 1, depth: 0, req });
  if (docs[0]) {
    await payload.update({ collection: "products", id: docs[0].id, data: { price: 300000, _status: "published" }, context, req });
    await payload.create({ collection: "stock", data: { product: docs[0].id, quantity: 0 }, context, req });
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.delete({ collection: "stock", where: { id: { exists: true } }, req });
}
