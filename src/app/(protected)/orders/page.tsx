import OrdersList from "@/components/ui/orders/order-list";
import { getCustomerOrders } from "@/app/(public)/my-orders/action";

export default async function Page() {
  const customerOrders = await getCustomerOrders({
    page: 1,
    page_size: 10,
  });

  return <OrdersList customerOrders={customerOrders.data} />;
}