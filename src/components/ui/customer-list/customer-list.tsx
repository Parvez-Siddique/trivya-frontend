
"use client";

import { useState } from "react";
import Datatable, {
  Column,
  Pagination,
} from "@/components/ui/datatable";

import {
  Users,
  getCustomers,
} from "@/app/(protected)/customers/action";

type CustomersListProps = {
  customerList: Users[];
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
};

export default function CustomersList({customerList, pagination, onPageChange}: CustomersListProps) {

  const [customerListData, setCustomerListData] = useState<Users[]>(customerList);

  const fetchData = async () => {
    const response = await getCustomers({
      page: 0,
      page_size: 10,
    });

    setCustomerListData(response?.data ?? []);
  };

  const columns: Column<Users>[] = [
  {
    key: "username",
    title: "Username",
    render: (value) => (
      <span className="font-medium">
        {String(value || "-")}
      </span>
    ),
  },

  // =========================================================
  // CUSTOMER
  // =========================================================
  {
    title: "Customer",
    render: (_, customer) => {
      const fullName = [
        customer.firstName,
        customer.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div className="min-w-[180px]">
          <p className="font-semibold text-sm">
            {fullName || "-"}
          </p>
        </div>
      );
    },
  },

  // =========================================================
  // CONTACT
  // =========================================================
  {
    title: "Contact",
    render: (_, customer) => (
      <div className="min-w-[220px] space-y-1">
        <p className="text-sm">
          {customer.email || "-"}
        </p>

        <p className="text-xs text-muted-foreground">
          {customer.phoneNumber || "-"}
        </p>
      </div>
    ),
  },

  // =========================================================
  // ADDRESS
  // =========================================================
  {
    title: "Address",
    render: (_, customer) => (
      <div className="min-w-[280px] max-w-[360px] text-sm leading-5">

        {/* Street */}
        {customer.streetName && (
          <p>
            {customer.streetName}
          </p>
        )}

        {/* Area */}
        {customer.area && (
          <p>
            {customer.area}
          </p>
        )}

        {/* City + Pincode */}
        {(customer.city || customer.pincode) && (
          <p>
            {customer.city || ""}
            {customer.city && customer.pincode
              ? ` - ${customer.pincode}`
              : customer.pincode || ""}
          </p>
        )}

        {/* State */}
        {customer.state && (
          <p className="text-xs text-muted-foreground">
            {customer.state}
          </p>
        )}

        {/* No Address */}
        {!customer.streetName &&
          !customer.area &&
          !customer.city &&
          !customer.state &&
          !customer.pincode && (
            <span className="text-muted-foreground">
              No address available
            </span>
          )}

      </div>
    ),
  },

  // =========================================================
  // USER TYPE
  // =========================================================
  {
    key: "user_type",
    title: "User Type",
    render: (value) => {
      const userType = String(value).toUpperCase();

      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            userType === "CUSTOMER"
              ? "bg-blue-100 text-blue-700"
              : userType === "ADMIN"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {userType}
        </span>
      );
    },
  },
];

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Customers
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage your customers.
          </p>
        </div>

      </div>

      {/* Customer Table */}
      <div className="min-w-[850px]">
        <Datatable
          data={customerListData}
          columns={columns}
          pagination={pagination}
          onPageChange={onPageChange}
          emptyMessage="No customers found."
        />

      </div>

    </div>
  );
}