import ProductList from "@/components/ui/product/product-list";
import { getProducts } from "@/app/(protected)/product/action";

const getProductsList = async (params: {
  page: number;
  page_size: number;
}) => { 
  const response = await getProducts(params);
  return response;
};

export default async function Page() {
  const response = await getProductsList({
    page: 1,
    page_size: 10,
  });

  return <ProductList productList={response.data ?? []} />;
}