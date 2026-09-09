import OrdersList from "@/components/ui/orders/order-list";
import {getCustomerSession} from "@/lib/session";
import {getCustomerOrders} from "@/app/(public)/my-orders/action";

export default async function Page() {
  const customerSession = await getCustomerSession();
  const customerOrders = await getCustomerOrders({ page: 1, page_size: 10, customer_id: customerSession?.id });

  return <OrdersList customerSession={customerSession} customerOrders={customerOrders.data} />;
}