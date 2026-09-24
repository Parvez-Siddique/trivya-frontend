import CartList from "@/components/ui/shop-products/cart-list";
import { getCustomerSession } from "@/lib/session";

export default async function Page() {
  const customerSession = await getCustomerSession();

  return (
    <CartList
      customerSession={customerSession}
    />
  );
}