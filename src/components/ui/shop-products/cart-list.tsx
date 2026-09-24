"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CartDetailDTO,
  CartStorageItem,
  getCartProductDetails
} from "@/app/(public)/shop-products/action";

import { toast } from "sonner";
import UserCreateModal from "@/components/ui/user-create-modal";

import {
  CreateOrderPayload,
  OrderDetails,
  CreateCustomerPayload,
  PlaceOrderPayload,
  placeOrder
} from "@/app/(public)/shop-products/action";

const CART_STORAGE_KEY = "trivya_cart";

export default function CartList({
  customerSession
}: {
  customerSession?: any;
}) {
  const router = useRouter();

  const [cartDetails, setCartDetails] = useState<CartDetailDTO[]>([]);

  const [loading, setLoading] = useState(true);

  const [updatingCart, setUpdatingCart] = useState(false);

  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState<"Create" | "Login">("Create");

  const [userCreateForm, setUserCreateForm] = useState<CreateCustomerPayload>({
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

  const [orderPayload, setOrderPayload] = useState<CreateOrderPayload>({
      user: 0,
      payment_status: "PENDING",
      total_quantity: "0",
      total_price: "0",
      order_details: [] as OrderDetails[],
    });

  const fetchCartDetails = async () => {
    try {
      setLoading(true);

      const storedCart =
        sessionStorage.getItem(
          CART_STORAGE_KEY
        );

      if (!storedCart) {
        setCartDetails([]);
        return;
      }

      const cart: CartStorageItem[] = JSON.parse(storedCart);

      if (
        !Array.isArray(cart) ||
        cart.length === 0
      ) {
        setCartDetails([]);
        return;
      }

      const response = await getCartProductDetails({cart});

      if (response.success) {
        setCartDetails(
          response.data ?? []
        );
      } else {

        setCartDetails([]);
      }
    } catch (error) {
      console.error(
        "Cart details error:",
        error
      );

      setCartDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const saveCartToSession = (
    cart: CartStorageItem[]
  ) => {
    sessionStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  };

  // =========================================================
  // GET CURRENT SESSION CART
  // =========================================================

  const getStoredCart = (): CartStorageItem[] => {
    try {
      const storedCart =
        sessionStorage.getItem(
          CART_STORAGE_KEY
        );

      if (!storedCart) {
        return [];
      }

      const cart = JSON.parse(
        storedCart
      );

      if (!Array.isArray(cart)) {
        return [];
      }

      return cart;
    } catch (error) {
      console.error(
        "Failed to read cart:",
        error
      );

      return [];
    }
  };

  // =========================================================
  // UPDATE PRODUCT QUANTITY
  // =========================================================

  const updateQuantity = async (
    productId: number,
    variationId: number,
    change: number
  ) => {
    if (updatingCart) {
      return;
    }

    try {
      setUpdatingCart(true);

      const cart = getStoredCart();

      const itemIndex = cart.findIndex(
        (item) =>
          item.productId === productId &&
          item.variationId === variationId
      );

      if (itemIndex === -1) {
        return;
      }

      const currentCount =
        Number(
          cart[itemIndex].product_count
        ) || 0;

      const newCount =
        currentCount + change;

      // =====================================================
      // REMOVE ITEM IF COUNT BECOMES ZERO
      // =====================================================

      if (newCount <= 0) {
        const updatedCart =
          cart.filter(
            (_, index) =>
              index !== itemIndex
          );

        saveCartToSession(
          updatedCart
        );

        setCartDetails((previous) =>
          previous.filter(
            (item) =>
              !(
                item.product_id ===
                  productId &&
                item.variation_id ===
                  variationId
              )
          )
        );

        return;
      }

      // =====================================================
      // UPDATE COUNT
      // =====================================================

      const updatedCart = [...cart];

      updatedCart[itemIndex] = {
        ...updatedCart[itemIndex],
        product_count: newCount,
      };

      saveCartToSession(
        updatedCart
      );

      // Update UI immediately
      setCartDetails((previous) =>
        previous.map((item) =>
          item.product_id ===
              productId &&
          item.variation_id ===
              variationId
            ? {
                ...item,
                product_count:
                  newCount,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Update cart quantity error:",
        error
      );
    } finally {
      setUpdatingCart(false);
    }
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeItem = (
    productId: number,
    variationId: number
  ) => {
    const cart = getStoredCart();

    const updatedCart =
      cart.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.variationId === variationId
          )
      );

    saveCartToSession(
      updatedCart
    );

    setCartDetails((previous) =>
      previous.filter(
        (item) =>
          !(
            item.product_id ===
              productId &&
            item.variation_id ===
              variationId
          )
      )
    );
  };

  // =========================================================
  // TOTAL QUANTITY
  // =========================================================

  const totalQuantity = useMemo(() => {
    return cartDetails.reduce(
      (total, item) =>
        total +
        Number(
          item.product_count || 0
        ),
      0
    );
  }, [cartDetails]);

  const handleCreateOrder = async () => {
    try {

      const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);

      if (!storedCart) {
        toast.error("Cart is empty", {
          description: "Please add products before placing the order.",
        });

        return;
      }

      const cart: CartStorageItem[] = JSON.parse(storedCart);

      if (!Array.isArray(cart) || cart.length === 0) {
        toast.error("Cart is empty", {
          description: "Please add products before placing the order.",
        });

        return;
      }


      const orderDetails: OrderDetails[] = cart.map((cartItem) => {
        const productDetails = cartDetails.find(
          (item) =>
            item.product_id === cartItem.productId &&
            item.variation_id === cartItem.variationId
        );

        return {
          product: cartItem.productId,
          quantity: Number(cartItem.product_count) || 0,
          product_size: productDetails?.size_variation || "",
          price: Number(productDetails?.price_variation) || 0,
        };
      });

      // =========================================================
      // CALCULATE ORDER TOTALS
      // =========================================================

      const totalQuantity = orderDetails.reduce(
        (total, item) => total + item.quantity,
        0
      );

      const totalPrice = orderDetails.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // =========================================================
      // CREATE ORDER PAYLOAD
      // =========================================================

      const orderData: CreateOrderPayload = {
        user: 0,
        payment_status: "PENDING",
        total_quantity: totalQuantity.toString(),
        total_price: totalPrice.toString(),
        order_details: orderDetails,
      };

      // =========================================================
      // UPDATE STATE
      // =========================================================

      setOrderPayload(orderData);

      // =========================================================
      // CREATE FINAL PAYLOAD
      // =========================================================

      const payload: PlaceOrderPayload = {
        customer_data: userCreateForm,
        order_data: orderData,
      };

      // =========================================================
      // PLACE ORDER
      // =========================================================

      const response = await placeOrder(payload);

      if (response.status !== "SUCCESS") {
        toast.error("Order Placement Failed", {
          description: "Unable to place the order.",
        });

        return;
      }

      // =========================================================
      // SUCCESS
      // =========================================================

      toast.success("Order Placed Successfully", {
        description: "Your order has been placed successfully.",
      });

      // Close modal
      setOpen(false);

      // Clear cart
      sessionStorage.removeItem(CART_STORAGE_KEY);

      // Clear UI cart
      setCartDetails([]);

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

      // Reset order payload
      setOrderPayload({
        user: 0,
        payment_status: "PENDING",
        total_quantity: "0",
        total_price: "0",
        order_details: [],
      });
    } catch (error) {
      console.error("Order creation error:", error);

      toast.error("Order Placement Failed", {
        description: "Something went wrong while placing the order.",
      });
    }
  };



  // =========================================================
  // TOTAL PRICE
  // =========================================================

  const totalPrice = useMemo(() => {
    return cartDetails.reduce(
      (total, item) => {
        const price =
          Number(
            item.price_variation
          ) || 0;

        const quantity =
          Number(
            item.product_count
          ) || 0;

        return (
          total +
          price * quantity
        );
      },
      0
    );
  }, [cartDetails]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <section
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-primary-background-lite
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              h-9
              w-9
              animate-spin
              rounded-full
              border-4
              border-primary-brown/20
              border-t-primary-thick
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-gray-500
            "
          >
            Loading your cart...
          </p>
        </div>
      </section>
    );
  }

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (cartDetails.length === 0) {
    return (
      <section
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-primary-background-lite
          px-5
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-primary-brown/15
            bg-white
            px-6
            py-12
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-primary-background
            "
          >
            <ShoppingCart
              className="
                h-7
                w-7
                text-primary-brown
              "
            />
          </div>

          <h1
            className="
              mt-5
              font-serif
              text-2xl
              font-semibold
              text-primary-thick
            "
          >
            Your cart is empty
          </h1>

          <p
            className="
              mx-auto
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-gray-500
            "
          >
            Add some of our natural
            care products to your cart
            and they will appear here.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/main-products"
              )
            }
            className="
              mt-6
              rounded-xl
              bg-primary-thick
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition-opacity
              hover:opacity-90
            "
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  // =========================================================
  // CART UI
  // =========================================================

  return (
    <section
      className="
        relative
        min-h-screen
        bg-primary-background-lite
        px-3
        pb-10
        sm:px-5
        md:px-8
        lg:px-12
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-6xl
        "
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header
          className="
            relative
            flex
            items-center
            justify-between
            py-5
            sm:py-7
            md:py-9
          "
        >
          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="
              group
              flex
              cursor-pointer
              items-center
              gap-1.5
              rounded-full
              px-2
              py-2
              text-sm
              font-medium
              text-primary-thick
              transition-all
              hover:bg-primary-brown/10
              sm:gap-2
              sm:text-base
            "
          >
            <ArrowLeft
              className="
                h-4
                w-4
                transition-transform
                group-hover:-translate-x-1
                sm:h-5
                sm:w-5
              "
            />

            <span>Back</span>
          </button>

          {/* TITLE */}

          <h1
            className="
              pointer-events-none
              absolute
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              font-serif
              text-2xl
              font-medium
              text-primary-thick
              sm:text-3xl
              md:text-4xl
            "
          >
            Your Cart
          </h1>

          {/* QUANTITY */}

          <div
            className="
              rounded-full
              bg-primary-background
              px-3
              py-1.5
              text-xs
              font-semibold
              text-primary-brown
              sm:px-4
              sm:py-2
              sm:text-sm
            "
          >
            {totalQuantity}{" "}
            {totalQuantity === 1
              ? "Item"
              : "Items"}
          </div>
        </header>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-[1fr_340px]
            lg:items-start
          "
        >
          {/* ================================================= */}
          {/* CART ITEMS */}
          {/* ================================================= */}

          <div className="space-y-4">
            {cartDetails.map(
              (item) => {
                const price =
                  Number(
                    item.price_variation
                  ) || 0;

                const quantity =
                  Number(
                    item.product_count
                  ) || 0;

                const itemTotal =
                  price * quantity;

                return (
                  <div
                    key={`${item.product_id}-${item.variation_id}`}
                    className="
                      overflow-hidden
                      rounded-3xl
                      border
                      border-primary-brown/10
                      bg-white
                      shadow-sm
                    "
                  >
                    <div
                      className="
                        flex
                        gap-4
                        p-4
                        sm:gap-5
                        sm:p-5
                      "
                    >
                      {/* ================================= */}
                      {/* IMAGE */}
                      {/* ================================= */}

                      <div
                        className="
                          flex
                          h-28
                          w-28
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-2xl
                          bg-primary-background
                          sm:h-36
                          sm:w-36
                        "
                      >
                        {item.product_image ? (
                          <img
                            src={
                              item.product_image
                            }
                            alt={
                              item.product_name
                            }
                            className="
                              h-full
                              w-full
                              object-contain
                              p-3
                            "
                          />
                        ) : (
                          <ShoppingCart
                            className="
                              h-8
                              w-8
                              text-primary-brown/40
                            "
                          />
                        )}
                      </div>

                      {/* ================================= */}
                      {/* DETAILS */}
                      {/* ================================= */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2
                              className="
                                font-serif
                                text-lg
                                font-semibold
                                text-primary-thick
                                sm:text-xl
                              "
                            >
                              {
                                item.product_name
                              }
                            </h2>

                            <p
                              className="
                                mt-1
                                text-sm
                                text-gray-500
                              "
                            >
                              {
                                item.size_variation
                              }
                            </p>
                          </div>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                item.product_id,
                                item.variation_id
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              cursor-pointer
                              items-center
                              justify-center
                              rounded-full
                              text-gray-400
                              transition-all
                              hover:bg-red-50
                              hover:text-red-500
                            "
                            aria-label={`Remove ${item.product_name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* ================================= */}
                        {/* PRICE */}
                        {/* ================================= */}

                        <p
                          className="
                            mt-3
                            text-base
                            font-bold
                            text-primary-thick
                          "
                        >
                          {item.price_variation
                            ? `₹${price.toLocaleString(
                                "en-IN"
                              )}`
                            : "—"}
                        </p>

                        {/* ================================= */}
                        {/* QUANTITY + TOTAL */}
                        {/* ================================= */}

                        <div
                          className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                          "
                        >
                          {/* QUANTITY */}

                          <div
                            className="
                              flex
                              items-center
                              rounded-xl
                              border
                              border-primary-brown/15
                              bg-primary-background-lite
                            "
                          >
                            <button
                              type="button"
                              disabled={
                                updatingCart
                              }
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.variation_id,
                                  -1
                                )
                              }
                              className="
                                flex
                                h-9
                                w-9
                                cursor-pointer
                                items-center
                                justify-center
                                text-primary-thick
                                transition-colors
                                hover:bg-primary-brown/10
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span
                              className="
                                min-w-9
                                text-center
                                text-sm
                                font-semibold
                                text-primary-thick
                              "
                            >
                              {
                                item.product_count
                              }
                            </span>

                            <button
                              type="button"
                              disabled={
                                updatingCart
                              }
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.variation_id,
                                  1
                                )
                              }
                              className="
                                flex
                                h-9
                                w-9
                                cursor-pointer
                                items-center
                                justify-center
                                text-primary-thick
                                transition-colors
                                hover:bg-primary-brown/10
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* ITEM TOTAL */}

                          <div className="text-right">
                            <p
                              className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.12em]
                                text-gray-400
                              "
                            >
                              Total
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-base
                                font-bold
                                text-primary-thick
                                sm:text-lg
                              "
                            >
                              ₹
                              {itemTotal.toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* ================================================= */}
          {/* ORDER SUMMARY */}
          {/* ================================================= */}

          <aside
            className="
              rounded-3xl
              border
              border-primary-brown/10
              bg-white
              p-5
              shadow-sm
              sm:p-6
              lg:sticky
              lg:top-5
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-gray-400
              "
            >
              Order Summary
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-2xl
                font-semibold
                text-primary-thick
              "
            >
              Your Order
            </h2>

            <div
              className="
                my-5
                h-px
                bg-primary-brown/10
              "
            />

            {/* ITEM COUNT */}

            <div
              className="
                flex
                items-center
                justify-between
                text-sm
                text-gray-600
              "
            >
              <span>Items</span>

              <span className="font-medium">
                {totalQuantity}
              </span>
            </div>

            {/* SUBTOTAL */}

            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                text-sm
                text-gray-600
              "
            >
              <span>Subtotal</span>

              <span className="font-medium">
                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            {/* TOTAL */}

            <div
              className="
                mt-5
                rounded-2xl
                bg-primary-background
                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <span
                  className="
                    text-sm
                    font-semibold
                    text-primary-thick
                  "
                >
                  Total Price
                </span>

                <span
                  className="
                    text-xl
                    font-bold
                    text-primary-thick
                    sm:text-2xl
                  "
                >
                  ₹
                  {totalPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            </div>

            {/* CHECKOUT */}

            <button
              type="button"
              className="
                mt-5
                w-full
                cursor-pointer
                rounded-xl
                bg-primary-thick
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200
                hover:opacity-90
                hover:shadow-md
              "
              onClick={() => {setOpen(true)}}
            >
              Proceed to Place Order
            </button>

            {/* CONTINUE SHOPPING */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/main-products"
                )
              }
              className="
                mt-3
                w-full
                cursor-pointer
                rounded-xl
                border
                border-primary-brown/15
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-primary-thick
                transition-colors
                hover:bg-primary-background
              "
            >
              Continue Shopping
            </button>
          </aside>
        </div>

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