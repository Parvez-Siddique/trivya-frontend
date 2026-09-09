import CreateProduct from "@/components/ui/product/createproduct";
import { getProductDetails } from "@/app/(protected)/product/action";

async function fetchProductDetails(productId: string) {
  const response = await getProductDetails({
    product_id: parseInt(productId, 10),
  });

  if (response.success) {
    return response.data;
  }

  console.error("Failed to fetch product details:", response.error);
  return null;
}

export default async function Page({params}: {
    params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const productDetails = await fetchProductDetails(id);

  return <CreateProduct productDetails={productDetails} mode={"edit"} />;
}