
"use client";

import { useState } from "react";
import { X, Package } from "lucide-react";
import { Button } from "@/components/ui/button"
import {CustomerOrderListDTO, updateOrderStatus, getCustomerOrders} from "@/app/(public)/my-orders/action";
import Datatable, {Column, Pagination} from "@/components/ui/datatable";
import OrderStatusModal from "@/components/ui/order-status-modal";
import { toast } from "sonner";

type CustomerOrdersProps = {
  customerOrders: CustomerOrderListDTO[] | undefined | null;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
};



function OrderDetailsRow({order}: {
  order: CustomerOrderListDTO;
}) {
  if (!order.order_details?.length) {
    return (
      <div className="border-t bg-muted/20 px-6 py-6">
        <div className="flex items-center justify-center rounded-xl border border-dashed bg-background px-6 py-8">
          <div className="text-center">
            <Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />

            <p className="text-sm font-medium text-muted-foreground">
              No items found for this order.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const orderTotal = order.order_details.reduce(
    (total, detail) =>
      total +
      Number(detail.price || 0) * Number(detail.quantity || 0),
    0
  );

  const totalQuantity = order.order_details.reduce(
    (total, detail) =>
      total + Number(detail.quantity || 0),
    0
  );

  return (
    <div className="border-t bg-muted/20">
      <div className="p-4 sm:p-6">

        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Order Details
            </p>

            <h4 className="mt-1 text-base font-semibold text-foreground">
              {order.order_details.length}{" "}
              {order.order_details.length === 1
                ? "Product"
                : "Products"}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              {totalQuantity}{" "}
              {totalQuantity === 1 ? "Item" : "Items"}
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-3">
          {order.order_details.map((detail) => {
            const price = Number(detail.price || 0);
            const quantity = Number(detail.quantity || 0);
            const itemTotal = price * quantity;

            return (
              <div
                key={detail.id}
                className="
                  group
                  rounded-2xl
                  border
                  bg-background
                  p-4
                  shadow-sm
                  transition-all
                  duration-200
                  hover:shadow-md
                "
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                  {/* Product */}
                  <div className="flex min-w-0 flex-1 items-center gap-4">

                    {/* Image */}
                    <div
                      className="
                        h-16
                        w-16
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        bg-muted/40
                        sm:h-20
                        sm:w-20
                      "
                    >
                      {detail.product_image ? (
                        <img
                          src={detail.product_image}
                          alt={detail.product_name}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                        {detail.product_name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Product ID: {detail.product}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">

                        {/* Size */}
                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          Size: {detail.product_size || "N/A"}
                        </span>

                        {/* Quantity */}
                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          Qty: {quantity}
                        </span>

                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-6
                      border-t
                      pt-3
                      sm:min-w-[180px]
                      sm:border-t-0
                      sm:pt-0
                      sm:text-right
                    "
                  >
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Unit Price
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        ₹{price.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total
                      </p>

                      <p className="mt-1 text-base font-bold text-foreground">
                        ₹{itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Total */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Order Total
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {totalQuantity}{" "}
              {totalQuantity === 1 ? "item" : "items"} in this order
            </p>
          </div>

          <p className="text-xl font-bold text-foreground">
            ₹{orderTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrdersList({customerOrders, pagination, onPageChange}: CustomerOrdersProps) {

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);

  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("");

  const [customerOrderList, setCustomerOrderList] = useState<CustomerOrderListDTO[] | null | undefined>(customerOrders);

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
      key: "order_status",
      title: "Order Status",
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

            <>

              <Button
                className="cursor-pointer"
                onClick={() => {
                  setSelectedOrderId(order.id);
                  setStatusModalOpen(true);
                }}
              >
                Update Status
              </Button>
            
            </>
            
          )}

        </div>
      ),
    },
  ];


  const fetchOrdersList = async () => {
    try {
      const response = await getCustomerOrders({
        page: 1,
        page_size: 10,
      });

      setCustomerOrderList(response.data);
    } catch (error) {
      console.error("Failed to fetch customer orders:", error);
    }
  };



  const order_status_list = [
    {
      value : "PENDING",
      label : "Pending"
    },
    {
      value : "CONFIRMED",
      label : "Confirmed"
    },

     {
      value : "DELIVERED",
      label : "Delivered"
    }
  ]

  const payment_status_list = [
    {
      value : "PENDING",
      label : "Pending"
    },
    {
      value : "PAYMENT_CONFIRMED",
      label : "Payment Confirmed"
    },

    {
      value : "PAYMENT_NOT_RECEIVED",
      label : "Payment Not Received"
    }
  ]


  const handleStatusUpdate = async () => {

    const response = await updateOrderStatus({
      order_id: selectedOrderId,
      payment_status: paymentStatus,
      order_status: orderStatus,
    });

    if (!response.success) {
      toast.error("Status Update Failed", {
        description: "Unable to update the order status.",
      });
      return;
    }

    toast.success("Status Updated Successfully", {
      description: "The order status has been updated successfully.",
    });

    await fetchOrdersList();

    setStatusModalOpen(false);
  };

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
          data={customerOrderList || []}
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


      <OrderStatusModal
        open={statusModalOpen}
        setOpen={setStatusModalOpen}
        payment_status_value={paymentStatus}
        payment_status_state={setPaymentStatus}
        order_status_value={orderStatus}
        order_status_state={setOrderStatus}
        paymentStatusList={payment_status_list}
        orderStatusList={order_status_list}
        onSave={handleStatusUpdate}
      />

    </div>
  );
}