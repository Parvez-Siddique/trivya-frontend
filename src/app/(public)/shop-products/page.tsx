
import ShopProducts from "@/components/ui/shop-products/products-list";
import { getCustomerSession } from "@/lib/session";
import { getPublicProductDetails } from "@/app/(public)/shop-products/action";

interface PageProps {
  searchParams: Promise<{
    productId?: string;
  }>;
}

export default async function Page({
  searchParams,
}: PageProps) {
  const customerSession = await getCustomerSession();

  const { productId } = await searchParams;

  if (!productId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Product not found.
        </p>
      </div>
    );
  }

  const productIdNumber = Number(productId);

  if (Number.isNaN(productIdNumber)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Invalid product.
        </p>
      </div>
    );
  }

  const response = await getPublicProductDetails({
    product_id: productIdNumber,
  });

  if (!response.success || !response.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Unable to load product details.
        </p>
      </div>
    );
  }

  return (
    <ShopProducts
      customerSession={customerSession}
      productDetails={response.data}
    />
  );
}
