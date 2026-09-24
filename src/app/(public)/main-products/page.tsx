import MainProducts from "@/components/ui/shop-products/main-products-list";
import {getCustomerSession} from "@/lib/session";

export default async function Page() {
  const customerSession = await getCustomerSession();

  return <MainProducts customerSession={customerSession} />;
}