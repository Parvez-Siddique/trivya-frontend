import CustomersList from "@/components/ui/customer-list/customer-list";
import { getCustomers } from "@/app/(protected)/customers/action";

const getCustomersList = async (params: {
  page: number;
  page_size: number;
}) => { 
  const response = await getCustomers(params);
  return response;
};

export default async function Page() {
  const response = await getCustomersList({
    page: 1,
    page_size: 10,
  });

  return <CustomersList customerList={response.data ?? []} />;
}