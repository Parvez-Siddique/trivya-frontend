import CustomerOrders from "@/components/ui/customer-orders/customer-orders";
import {getCustomerSession} from "@/lib/session";
import {getMyOrders} from "@/app/(public)/my-orders/action";

export default async function Page() {
  const customerSession = await getCustomerSession();
  const customerOrders = await getMyOrders({ page: 1, page_size: 10, customer_id: customerSession?.id });

  return <CustomerOrders customerSession={customerSession} customerOrders={customerOrders.data} />;
}