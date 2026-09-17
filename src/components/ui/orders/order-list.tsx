
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