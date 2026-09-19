
"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import {
  getProductsPublicList,
  Product,
} from "@/app/(protected)/product/action";

import {
  CreateOrderPayload,
  OrderDetails,
  CreateCustomerPayload,
  placeOrder,
  PlaceOrderPayload,
} from "@/app/(public)/shop-products/action";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UserCreateModal from "@/components/ui/user-create-modal";

export default function ShopProducts({
  customerSession,
}: {
  customerSession?: any;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState<"Create" | "Login">("Create");

  const [userCreateForm, setUserCreateForm] =
    useState<CreateCustomerPayload>({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      user_type: "CUSTOMER",
      streetName: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
    });

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);

  const [quantities, setQuantities] = useState<{
    [key: number]: number;
  }>({});

  const [orderPayload, setOrderPayload] =
    useState<CreateOrderPayload>({
      user: 0,
      payment_status: "PENDING",
      total_quantity: "0",
      total_price: "0",
      order_details: [] as OrderDetails[],
    });

  const userSession = customerSession;

  // =========================================================
  // GET PRODUCTS
  // =========================================================

  const getProductsList = async () => {
    try {
      const response = await getProductsPublicList({
        page: 0,
        page_size: 10,
      });

      if (response.success) {
        setProducts(response.data ?? []);
      } else {
        console.error(
          "Failed to fetch products:",
          response.error
        );
      }
    } catch (error) {
      console.error("Get products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductsList();
  }, []);


  const increaseQuantity = (id: number) => {
    const product = products.find(
      (product) => product.id === id
    );

    if (!product) return;

    setQuantities((current) => {
      const newQuantity = (current[id] || 0) + 1;

      return {
        ...current,
        [id]: newQuantity,
      };
    });

    setOrderPayload((prevPayload) => {
      const existingOrderDetail =
        prevPayload.order_details.find(
          (orderDetail) => orderDetail.product === id
        );

      let updatedOrderDetails: OrderDetails[];

      if (existingOrderDetail) {
        updatedOrderDetails =
          prevPayload.order_details.map((orderDetail) =>
            orderDetail.product === id
              ? {
                  ...orderDetail,
                  quantity: orderDetail.quantity + 1,
                }
              : orderDetail
          );
      } else {
        updatedOrderDetails = [
          ...prevPayload.order_details,
          {
            product: id,
            quantity: 1,
            price: product.price,
          },
        ];
      }

      const totalQuantity =
        updatedOrderDetails.reduce(
          (total, item) => total + item.quantity,
          0
        );

      const totalPrice =
        updatedOrderDetails.reduce(
          (total, item) =>
            total + item.quantity * item.price,
          0
        );

      return {
        ...prevPayload,
        user: userSession?.id ?? 0,
        order_details: updatedOrderDetails,
        total_quantity: String(totalQuantity),
        total_price: String(totalPrice),
      };
    });
  };

  const decreaseQuantity = (id: number) => {
    setQuantities((current) => {
      const currentQuantity = current[id] || 0;

      const newQuantity = Math.max(
        currentQuantity - 1,
        0
      );

      return {
        ...current,
        [id]: newQuantity,
      };
    });

    setOrderPayload((prevPayload) => {
      const existingOrderDetail =
        prevPayload.order_details.find(
          (orderDetail) => orderDetail.product === id
        );

      if (!existingOrderDetail) {
        return prevPayload;
      }

      const newQuantity =
        existingOrderDetail.quantity - 1;

      let updatedOrderDetails: OrderDetails[];

      if (newQuantity <= 0) {
        updatedOrderDetails =
          prevPayload.order_details.filter(
            (orderDetail) =>
              orderDetail.product !== id
          );
      } else {
        updatedOrderDetails =
          prevPayload.order_details.map(
            (orderDetail) =>
              orderDetail.product === id
                ? {
                    ...orderDetail,
                    quantity: newQuantity,
                  }
                : orderDetail
          );
      }

      const totalQuantity =
        updatedOrderDetails.reduce(
          (total, item) => total + item.quantity,
          0
        );

      const totalPrice =
        updatedOrderDetails.reduce(
          (total, item) =>
            total + item.quantity * item.price,
          0
        );

      return {
        ...prevPayload,
        user: userSession?.id ?? 0,
        order_details: updatedOrderDetails,
        total_quantity: String(totalQuantity),
        total_price: String(totalPrice),
      };
    });
  };

  const getQuantity = (id: number) => {
    return quantities[id] || 0;
  };

  const handleCreateUserModalOpen = () => {
    setOpen(true);
  };

  const handleCreateOrder = async () => {
    try {
      const payload: PlaceOrderPayload = {
        customer_data: userCreateForm,
        order_data: orderPayload,
      };

      const response = await placeOrder(payload);

      if (response.status !== "SUCCESS") {
        toast.error("Order Placement Failed", {
          description:
            "Unable to place the order.",
        });

        return;
      }

      toast.success("Order Placed Successfully", {
        description:
          "Your order has been placed successfully.",
      });

      // Reset order
      setOrderPayload({
        user: 0,
        payment_status: "PENDING",
        total_quantity: "0",
        total_price: "0",
        order_details: [],
      });

      // Reset quantities
      setQuantities({});

      // Close modal
      setOpen(false);

      // Reset customer form
      setUserCreateForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        user_type: "CUSTOMER",
        streetName: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (error) {
      console.error(
        "Order creation error:",
        error
      );

      toast.error("Order Placement Failed", {
        description:
          "Something went wrong while placing the order.",
      });
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <section
      id="productsSection"
      className="
        relative
        h-dvh
        w-full
        overflow-hidden
        px-3
        sm:px-5
        md:px-8
        lg:px-12
        xl:px-16
        2xl:px-20
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-7xl
          flex-col
        "
      >

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div
          className="
            shrink-0
            px-1
            pb-4
            pt-5
            sm:pb-5
            sm:pt-7
            md:px-2
            md:pb-6
            md:pt-10
            lg:pt-12
          "
        >
          <div
            className="
              relative
              flex
              min-h-9
              items-center
              justify-between
            "
          >

            {/* Back Button */}

            <button
              type="button"
              onClick={() => router.push("/")}
              className="
                cursor-pointer
                group
                flex
                shrink-0
                items-center
                gap-1.5
                text-sm
                font-medium
                text-primary-thick
                transition-opacity
                hover:opacity-70
                sm:gap-2
                sm:text-base
              "
            >
              <ArrowLeft
                className="
                  h-4
                  w-4
                  transition-transform
                  group-hover:-translate-x-0.5
                  sm:h-5
                  sm:w-5
                "
              />

              <span>Back</span>
            </button>

            {/* Center Title */}

            <p
              className="
                pointer-events-none
                absolute
                left-1/2
                -translate-x-1/2
                whitespace-nowrap
                font-serif
                text-xl
                text-primary-thick
                sm:text-2xl
                md:text-3xl
                lg:text-4xl
                xl:text-5xl
              "
            >
              Shop Our Products
            </p>

            {/* Right Spacer */}

            <div className="w-[52px] sm:w-[65px]" />
          </div>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              px-2
              text-center
              text-xs
              leading-5
              text-gray-600
              sm:mt-5
              sm:text-sm
              sm:leading-6
              md:mt-6
              md:text-base
              md:leading-7
            "
          >
            Discover our carefully crafted hair care
            products designed to nourish, strengthen
            and care for your hair.
          </p>
        </div>

        {/* ===================================================== */}
        {/* PRODUCTS SCROLL AREA */}
        {/* ===================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            pb-4
            pr-1
            sm:pb-5
            sm:pr-2
            md:pb-6
          "
        >

          {/* =================================================== */}
          {/* LOADING */}
          {/* =================================================== */}

          {loading && (
            <div
              className="
                flex
                min-h-[240px]
                flex-col
                items-center
                justify-center
              "
            >
              <div
                className="
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-4
                  border-primary-brown/20
                  border-t-primary-thick
                  sm:h-10
                  sm:w-10
                "
              />

              <p
                className="
                  mt-3
                  text-xs
                  text-gray-500
                  sm:mt-4
                  sm:text-sm
                "
              >
                Loading products...
              </p>
            </div>
          )}

          {/* =================================================== */}
          {/* EMPTY STATE */}
          {/* =================================================== */}

          {!loading && products.length === 0 && (
            <div
              className="
                rounded-2xl
                border
                border-primary-brown/20
                bg-primary-background-lite
                px-5
                py-12
                text-center
                sm:py-16
              "
            >
              <ShoppingBag
                className="
                  mx-auto
                  h-9
                  w-9
                  text-primary-brown/50
                  sm:h-10
                  sm:w-10
                "
              />

              <p
                className="
                  mt-4
                  text-base
                  font-semibold
                  text-primary-thick
                  sm:text-lg
                "
              >
                No products available
              </p>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-sm
                  text-xs
                  leading-5
                  text-gray-500
                  sm:text-sm
                  sm:leading-6
                "
              >
                Please check back later for our
                products.
              </p>
            </div>
          )}

          {/* =================================================== */}
          {/* PRODUCTS */}
          {/* =================================================== */}

          {!loading && products.length > 0 && (
            <div
              className="
                space-y-4
                sm:space-y-6
                md:space-y-8
              "
            >
              {products.map((product) => {
                const quantity = getQuantity(
                  product.id
                );

                const unitPrice =
                  Number(product.price);

                const totalPrice =
                  unitPrice * quantity;

                return (
                  <div
                    key={product.id}
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-primary-brown/15
                      bg-primary-background-lite
                      shadow-sm
                      transition-all
                      duration-300
                      hover:shadow-lg
                      sm:rounded-3xl
                      md:hover:-translate-y-1
                      md:hover:shadow-xl
                    "
                  >
                    <div
                      className="
                        flex
                        min-h-0
                        flex-col
                        md:min-h-[420px]
                        md:flex-row
                      "
                    >

                      {/* ======================================= */}
                      {/* IMAGE */}
                      {/* ======================================= */}

                      <div
                        className="
                          relative
                          flex
                          h-[250px]
                          w-full
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          bg-primary-background
                          sm:h-[300px]
                          md:h-auto
                          md:min-h-[420px]
                          md:w-[44%]
                          lg:w-[42%]
                          xl:w-[40%]
                        "
                      >

                        {/* Background Decoration */}

                        <div
                          className="
                            absolute
                            -left-16
                            -top-16
                            h-40
                            w-40
                            rounded-full
                            bg-primary-brown/5
                            blur-3xl
                            sm:h-56
                            sm:w-56
                          "
                        />

                        <div
                          className="
                            absolute
                            -bottom-16
                            -right-16
                            h-40
                            w-40
                            rounded-full
                            bg-primary-brown/5
                            blur-3xl
                            sm:h-56
                            sm:w-56
                          "
                        />

                        {/* Product Image */}

                        <img
                          src={product.product_image}
                          alt={product.product_name}
                          className="
                            relative
                            z-10
                            h-full
                            w-full
                            object-contain
                            p-7
                            transition-transform
                            duration-500
                            group-hover:scale-105
                            sm:p-9
                            md:p-10
                            lg:p-12
                            xl:p-14
                          "
                        />

                        {/* Image Overlay */}

                        <div
                          className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-gradient-to-r
                            from-transparent
                            via-transparent
                            to-primary-background-lite/30
                          "
                        />

                        {/* Product Badge */}

                        <div
                          className="
                            absolute
                            left-3
                            top-3
                            z-20
                            rounded-full
                            border
                            border-primary-brown/10
                            bg-white/80
                            px-3
                            py-1
                            text-[10px]
                            font-semibold
                            tracking-wide
                            text-primary-thick
                            shadow-sm
                            backdrop-blur-sm
                            sm:left-5
                            sm:top-5
                            sm:px-4
                            sm:py-1.5
                            sm:text-xs
                          "
                        >
                          Natural Care
                        </div>
                      </div>

                      {/* ======================================= */}
                      {/* CONTENT */}
                      {/* ======================================= */}

                      <div
                        className="
                          flex
                          min-w-0
                          flex-1
                          flex-col
                          px-5
                          py-6
                          sm:px-7
                          sm:py-8
                          md:px-9
                          md:py-9
                          lg:px-11
                          lg:py-10
                          xl:px-14
                        "
                      >

                        {/* Product Heading */}

                        <div className="min-w-0">

                          <p
                            className="
                              mb-1.5
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-[0.18em]
                              text-primary-brown/70
                              sm:mb-2
                              sm:text-xs
                              sm:tracking-[0.2em]
                            "
                          >
                            Hair Care
                          </p>

                          <h2
                            className="
                              break-words
                              font-serif
                              text-2xl
                              font-semibold
                              leading-tight
                              text-primary-thick
                              sm:text-3xl
                              md:text-4xl
                            "
                          >
                            {product.product_name}
                          </h2>

                          <p
                            className="
                              mt-1.5
                              break-words
                              text-sm
                              font-medium
                              text-primary-brown
                              sm:mt-2
                              sm:text-base
                              md:text-lg
                            "
                          >
                            {product.subheading}

                            <span
                              className="
                                mx-1.5
                                text-primary-brown/30
                                sm:mx-2
                              "
                            >
                              •
                            </span>

                            {product.product_qty}
                          </p>
                        </div>

                        {/* Description */}

                        <p
                          className="
                            mt-4
                            max-w-2xl
                            text-xs
                            leading-6
                            text-gray-600
                            sm:mt-5
                            sm:text-sm
                            sm:leading-7
                            md:text-base
                          "
                        >
                          {product.description}
                        </p>

                        {/* Divider */}

                        <div
                          className="
                            my-5
                            h-px
                            w-full
                            bg-primary-brown/10
                            sm:my-7
                          "
                        />

                        {/* ===================================== */}
                        {/* PRICE + QUANTITY */}
                        {/* ===================================== */}

                        <div
                          className="
                            flex
                            flex-col
                            gap-5
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                            sm:gap-4
                          "
                        >

                          {/* Unit Price */}

                          <div>
                            <p
                              className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.16em]
                                text-gray-500
                                sm:text-xs
                                sm:tracking-[0.18em]
                              "
                            >
                              Unit Price
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-2xl
                                font-bold
                                text-primary-thick
                                sm:mt-1
                                sm:text-3xl
                              "
                            >
                              ₹
                              {unitPrice.toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>

                          {/* Quantity */}

                          <div
                            className="
                              flex
                              items-end
                              justify-between
                              sm:block
                            "
                          >
                            <p
                              className="
                                mb-2
                                text-left
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.16em]
                                text-gray-500
                                sm:text-right
                                sm:text-xs
                                sm:tracking-[0.18em]
                              "
                            >
                              Quantity
                            </p>

                            <div
                              className="
                                flex
                                h-11
                                items-center
                                rounded-xl
                                border
                                border-primary-brown/20
                                bg-white
                                px-1.5
                                shadow-sm
                                sm:h-12
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(
                                    product.id
                                  )
                                }
                                className="
                                  flex
                                  h-8
                                  w-8
                                  cursor-pointer
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-primary-thick
                                  transition-all
                                  hover:bg-primary-brown/10
                                  active:scale-95
                                  sm:h-9
                                  sm:w-9
                                "
                              >
                                <Minus
                                  className="
                                    h-3.5
                                    w-3.5
                                    sm:h-4
                                    sm:w-4
                                  "
                                />
                              </button>

                              <span
                                className="
                                  flex
                                  min-w-[38px]
                                  justify-center
                                  text-sm
                                  font-bold
                                  text-primary-thick
                                "
                              >
                                {quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(
                                    product.id
                                  )
                                }
                                className="
                                  flex
                                  h-8
                                  w-8
                                  cursor-pointer
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-primary-thick
                                  transition-all
                                  hover:bg-primary-brown/10
                                  active:scale-95
                                  sm:h-9
                                  sm:w-9
                                "
                              >
                                <Plus
                                  className="
                                    h-3.5
                                    w-3.5
                                    sm:h-4
                                    sm:w-4
                                  "
                                />
                              </button>

                            </div>
                          </div>
                        </div>

                        {/* ===================================== */}
                        {/* ORDER SUMMARY */}
                        {/* ===================================== */}

                        <div
                          className="
                            mt-5
                            rounded-xl
                            border
                            border-primary-brown/10
                            bg-white/70
                            p-4
                            shadow-sm
                            sm:mt-7
                            sm:rounded-2xl
                            sm:p-5
                          "
                        >

                          {/* Summary Header */}

                          <div
                            className="
                              mb-3
                              flex
                              items-center
                              justify-between
                              gap-3
                              sm:mb-4
                            "
                          >

                            <div className="min-w-0">

                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-primary-thick
                                  sm:text-base
                                "
                              >
                                Order Summary
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  text-[11px]
                                  text-gray-500
                                  sm:text-xs
                                "
                              >
                                Your selected quantity
                              </p>

                            </div>

                            <div
                              className="
                                shrink-0
                                rounded-full
                                bg-primary-brown/10
                                px-2.5
                                py-1
                                text-[10px]
                                font-semibold
                                text-primary-brown
                                sm:px-3
                                sm:text-xs
                              "
                            >
                              {quantity}{" "}
                              {quantity === 1
                                ? "item"
                                : "items"}
                            </div>
                          </div>

                          {/* Calculation */}

                          <div
                            className="
                              space-y-2.5
                              sm:space-y-3
                            "
                          >

                            {/* Price Per Item */}

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                text-xs
                                sm:text-sm
                              "
                            >
                              <span className="text-gray-500">
                                Price per item
                              </span>

                              <span
                                className="
                                  shrink-0
                                  font-medium
                                  text-gray-700
                                "
                              >
                                ₹
                                {unitPrice.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </div>

                            {/* Quantity */}

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                text-xs
                                sm:text-sm
                              "
                            >
                              <span className="text-gray-500">
                                Quantity
                              </span>

                              <span
                                className="
                                  shrink-0
                                  font-medium
                                  text-gray-700
                                "
                              >
                                × {quantity}
                              </span>
                            </div>

                            {/* Divider */}

                            <div className="h-px bg-primary-brown/10" />

                            {/* Total */}

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-4
                              "
                            >
                              <span
                                className="
                                  text-xs
                                  font-semibold
                                  text-primary-thick
                                  sm:text-sm
                                "
                              >
                                Item Total
                              </span>

                              <span
                                className="
                                  shrink-0
                                  text-lg
                                  font-bold
                                  text-primary-thick
                                  sm:text-xl
                                "
                              >
                                ₹
                                {totalPrice.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===================================================== */}
        {/* FIXED PLACE ORDER */}
        {/* ===================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-primary-brown/10
            bg-white/95
            py-3
            backdrop-blur-sm
            sm:py-4
            md:py-5
          "
        >
          <div className="flex w-full justify-end">

            <button
              onClick={handleCreateUserModalOpen}
              disabled={
                orderPayload.order_details.length === 0
              }
              type="button"
              className="
                flex
                h-11
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-2.5
                rounded-xl
                bg-primary-thick
                px-6
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:opacity-90
                hover:shadow-md
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:h-12
                sm:w-auto
                sm:min-w-[200px]
                sm:gap-3
                sm:px-8
                sm:text-sm
              "
            >
              <ShoppingBag
                className="
                  h-3.5
                  w-3.5
                  sm:h-4
                  sm:w-4
                "
              />

              <span>Place Order</span>

              <ArrowRight
                className="
                  h-3.5
                  w-3.5
                  sm:h-4
                  sm:w-4
                "
              />
            </button>

          </div>
        </div>

        {/* ===================================================== */}
        {/* USER MODAL */}
        {/* ===================================================== */}

        <UserCreateModal
          open={open}
          setOpen={setOpen}
          mode={mode}
          setMode={setMode}
          userCreateForm={userCreateForm}
          setUserCreateForm={setUserCreateForm}
          singleTab={true}
          singleTabName={"Create"}
          onOrderPlaced={handleCreateOrder}
        />

      </div>
    </section>
  );
}