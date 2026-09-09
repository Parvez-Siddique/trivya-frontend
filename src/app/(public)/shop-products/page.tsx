import ShopProducts from "@/components/ui/shop-products/products-list";
import {getCustomerSession} from "@/lib/session";

export default async function Page() {
  const customerSession = await getCustomerSession();

  return <ShopProducts customerSession={customerSession} />;
}