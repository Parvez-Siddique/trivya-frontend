"use client";
import {useState} from "react";
import { Pencil, Trash2 } from "lucide-react";
import {useRouter} from "next/navigation";
import Datatable, {Column, Pagination} from "@/components/ui/datatable";
import {Product, handleProductStatusChange, getProducts, handleProductDelete } from "@/app/(protected)/product/action";
import { Switch } from "@/components/ui/switch";

type ProductListProps = {
  productList: Product[];
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
};

export default function ProductList({
  productList,
  pagination,
  onPageChange
}: ProductListProps) {
  const router = useRouter();

  const [productListData, setProductListData] = useState<Product[]>(productList)

  const fetchData = async () => {
      const response = await getProducts({page : 0, page_size : 10})
      setProductListData(response?.data ?? [])
  }

  const handleStatusChange = async (productId : number, isActive : boolean) => {
      const response = await handleProductStatusChange({productId: productId, isActive : isActive})

      if (response.success) {
          fetchData();
      };
  };

  const handleEdit = (product: Product) => {
    router.push(`/product/create/${product.id}`);
  };

  const handleDelete = async (productId: number) => {
    const response = await handleProductDelete(productId)

      if (response.success) {
          fetchData();
      };
  };

  const handleCreate = () => {
    router.push("/product/create"); 
  };

  const columns: Column<Product>[] = [
    {
        key: "product_image",
        title: "Image",
        render: (value) => (
        <img
            src={String(value)}
            alt="Product"
            className="h-12 w-12 rounded-md object-cover"
        />
        ),
    },

    {
        key: "product_name",
        title: "Product Name",
    },

    {
        key: "subheading",
        title: "Subheading",
        render: (value) => (
        <span className="line-clamp-1 max-w-[250px]">
            {String(value || "-")}
        </span>
        ),
    },

    {
        key: "description",
        title: "Description",
        render: (value) => (
        <span className="line-clamp-1 max-w-[300px]">
            {String(value || "-")}
        </span>
        ),
    },

    {
        key: "price",
        title: "Price",
        render: (value) => (
        <span className="font-medium">
            ₹{Number(value).toFixed(2)}
        </span>
        ),
    },

    {
        key: "created_at",
        title: "Created At",
        render: (value) =>
        new Date(String(value)).toLocaleDateString("en-IN"),
    },

    {
        title: "Actions",
        render: (_, product) => (
            <div className="flex items-center gap-2 cursor-pointer">

              <Switch
                  checked={product.isActive}
                  onCheckedChange={(checked) =>
                      handleStatusChange(product.id, checked)
                  }
              />
              <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-gray-100 cursor-pointer"
              >
                  <Pencil className="h-4 w-4" />
              </button>

              <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border text-red-500 hover:bg-red-50 cursor-pointer"
              >
                  <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
        ),
    },
];

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Products
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage your products.
          </p>

        </div>


        <div>
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer"
            onClick={() => {
              handleCreate();
            }}
          >
            Create New Product
          </button>
        </div>
        
      </div>

      {/* Product Table */}
      <Datatable
        data={productListData}
        columns={columns}
        pagination={pagination}
        onPageChange={onPageChange}
        emptyMessage="No products found."
      />

    </div>
  );
}