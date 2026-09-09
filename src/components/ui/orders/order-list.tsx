
"use client";

import { useState } from "react";
import { X, Package } from "lucide-react";

import type {
  CustomerOrderListDTO,
} from "@/app/(public)/my-orders/action";

import Datatable, {
  Column,
  Pagination,
} from "@/components/ui/datatable";

import { SessionUser } from "@/lib/session";

type CustomerOrdersProps = {
  customerOrders: CustomerOrderListDTO[] | undefined | null;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
};

/**
 * Expanded Order Details
 */
function OrderDetailsRow({
  order,
}: {
  order: CustomerOrderListDTO;
}) {
  if (!order.order_details?.length) {
    return (
      <div className="border-t bg-muted/30 px-6 py-5 text-sm text-muted-foreground">
        No items found for this order.
      </div>
    );
  }

  return (
    <div className="border-t bg-muted/30 p-5">
      <h4 className="mb-4 text-sm font-semibold">
        Order Items
      </h4>

      <div className="overflow-x-auto">
        <div className="min-w-[650px] overflow-hidden rounded-lg border bg-background">

          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_140px] border-b bg-muted/40 px-4 py-3 text-xs font-semibold text-muted-foreground">
            <div>Product</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Price</div>
          </div>

          {/* Products */}
          {order.order_details.map((detail) => (
            <div
              key={detail.id}
              className="grid grid-cols-[1fr_120px_140px] items-center gap-4 border-b p-4 last:border-b-0"
            >
              {/* Product */}
              <div className="flex items-center gap-3">

                {/* Product Image */}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                  {detail.product_image ? (
                    <img
                      src={detail.product_image}
                      alt={detail.product_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <div>
                  <p className="font-medium">
                    {detail.product_name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Product ID: {detail.product}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Quantity
                </p>

                <p className="mt-1 font-medium">
                  {detail.quantity}
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Price
                </p>

                <p className="mt-1 font-medium">
                  ₹{Number(detail.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrdersList({customerOrders, pagination, onPageChange}: CustomerOrdersProps) {
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  const handleCancelOrder = async (orderId: number) => {
    try {
      setCancellingOrderId(orderId);

    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  const columns: Column<CustomerOrderListDTO>[] = [
    {
      key: "order_code",
      title: "Order Code",
      render: (value) => (
        <span className="font-medium">
          #{String(value)}
        </span>
      ),
    },

    {
      key: "customer_name",
      title: "Customer",
      render: (value) => (
        <span className="font-medium">
          {String(value || "-")}
        </span>
      ),
    },

    {
      key: "total_quantity",
      title: "Items",
      render: (value) => (
        <span>
          {String(value)}
        </span>
      ),
    },

    {
      key: "total_price",
      title: "Total",
      render: (value) => (
        <span className="font-medium">
          ₹{Number(value).toFixed(2)}
        </span>
      ),
    },

    {
      key: "payment_status",
      title: "Payment Status",
      render: (value) => {
        const status = String(value).toUpperCase();

        return (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : status === "PAID"
                ? "bg-green-100 text-green-700"
                : status === "CANCELLED"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },

    {
      key: "created_at",
      title: "Created At",
      render: (value) =>
        new Date(
          String(value)
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },

    {
      title: "Actions",
      render: (_, order) => (
        <div className="flex items-center gap-2">

          {order.payment_status !== "CANCELLED" && (
            <button
              type="button"
              onClick={() =>
                handleCancelOrder(order.id)
              }
              disabled={cancellingOrderId === order.id}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 px-3 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              title="Cancel Order"
            >
              <X className="h-4 w-4" />

              <span>
                {cancellingOrderId === order.id
                  ? "Cancelling..."
                  : "Cancel Order"}
              </span>
            </button>
          )}

        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full justify-center px-4 py-6">
      <div className="mb-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Customer Orders
          </h1>

          <p className="text-sm text-muted-foreground">
            View and manage customer orders.
          </p>
        </div>
      </div>
        
      <div className="min-w-[1000px]">
        <Datatable
          data={customerOrders || []}
          columns={columns}
          pagination={pagination}
          onPageChange={onPageChange}
          emptyMessage="No orders found."
          expandable
          expandedRow={(order) => (
            <OrderDetailsRow order={order} />
          )}
        />

      </div>

    </div>
  );
}