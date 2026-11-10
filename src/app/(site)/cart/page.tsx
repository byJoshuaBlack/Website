import { redirect } from "next/navigation";

// The cart and checkout are one page.
export default function CartPage() {
  redirect("/checkout");
}
