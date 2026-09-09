"use client";

import { useEffect, useState } from "react";
import {ShoppingBag, Plus, Minus, ArrowLeft, ArrowRight} from "lucide-react";
import {getProductsPublicList, Product} from "@/app/(protected)/product/action";
import {createOrder, CreateOrderPayload, OrderDetails} from "@/app/(public)/shop-products/action";
import { toast } from "sonner";
import {useRouter} from "next/navigation";
import UserCreateModal from "@/components/ui/user-create-modal";
import {createUser, CreateUserPayload} from "@/app/(public)/customer/action";

export default function ShopProducts({ customerSession }: { customerSession?: any }) {

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<"Create" | "Login">("Create");
  const [userCreateForm, setUserCreateForm] = useState<CreateUserPayload>({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          username: "",
          password: "",
          user_type: "CUSTOMER"
        });

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [orderPayload, setOrderPayload] = useState<CreateOrderPayload>({
    user : 0,
    payment_status : "PENDING",
    total_quantity : "0",
    total_price: "0",
    order_details: [] as OrderDetails[]
  });

  const userSession = customerSession

  const getProductsList = async () => {
    try {
      const response = await getProductsPublicList({page: 0, page_size: 10});

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
    const product = products.find((p) => p.id === id);

    if (!product) return;

    setQuantities((current) => {
      const newQuantity = (current[id] || 0) + 1;

      return {
        ...current,
        [id]: newQuantity,
      };
    });

    setOrderPayload((prevPayload) => {
      const existingOrderDetail = prevPayload.order_details.find(
        (od) => od.product === id
      );

      let updatedOrderDetails: OrderDetails[];

      if (existingOrderDetail) {
        updatedOrderDetails = prevPayload.order_details.map((od) =>
          od.product === id
            ? {
                ...od,
                quantity: od.quantity + 1,
              }
            : od
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

      const totalQuantity = updatedOrderDetails.reduce(
        (total, item) => total + item.quantity,
        0
      );

      const totalPrice = updatedOrderDetails.reduce(
        (total, item) => total + item.quantity * item.price,
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
      const newQuantity = Math.max(currentQuantity - 1, 0);

      return {...current, [id]: newQuantity};
    });

    setOrderPayload((prevPayload) => {
      const existingOrderDetail = prevPayload.order_details.find(
        (od) => od.product === id
      );

      if (!existingOrderDetail) {
        return prevPayload;
      }

      const newQuantity = existingOrderDetail.quantity - 1;

      let updatedOrderDetails: OrderDetails[];

      if (newQuantity <= 0) {
        updatedOrderDetails = prevPayload.order_details.filter(
          (od) => od.product !== id
        );
      } else {
        updatedOrderDetails = prevPayload.order_details.map((od) =>
          od.product === id
            ? {
                ...od,
                quantity: newQuantity,
              }
            : od
        );
      }

      const totalQuantity = updatedOrderDetails.reduce((total, item) => total + item.quantity, 0);

      const totalPrice = updatedOrderDetails.reduce((total, item) => total + item.quantity * item.price, 0);

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

  const handleCreateUserModalOpen = async () => {
      setOpen(true)
  }

  const handleCreateOrder = async () => {

    const userResponse = await createUser(userCreateForm)

    console.log(userResponse,"USERREPSOSSOJSOJSOJSOJS");

    if(!userResponse.success) {

      const response = await createOrder(orderPayload);

      if (response.success) {
        setOrderPayload({
          user : 0,
          payment_status : "PENDING",
          total_quantity : "0",
          total_price: "0",
          order_details: [] as OrderDetails[]
        })
        setQuantities({})
      } else {
        console.error("Failed to create order:", response.error);
      }
      toast.error(userResponse.error || "Failed to create user");
      return;
    }
  }

  return (
    <section id="productsSection"
      className="relative w-full px-6 md:px-12 lg:px-20 py-16 md:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        
        <div className="mb-14">
          {/* Header */}
          <div className="relative flex items-center justify-between">

            
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-primary-thick font-medium hover:opacity-80 transition-opacity cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            {/* Center Title */}
            <p className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-4xl lg:text-5xl font-serif text-primary-thick whitespace-nowrap">
              Shop Our Products
            </p>

            {/* My Orders Button */}
            {/* <button
              type="button"
              onClick={() => routerToMyOrders()}
              className="flex items-center gap-2 text-primary-thick font-medium hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span>My Orders</span>
              <ShoppingBag className="w-5 h-5" />
            </button> */}

          </div>

          {/* Description */}
          <p className="mt-6 max-w-2xl mx-auto text-center text-sm md:text-base leading-7 text-gray-600">
            Discover our carefully crafted hair care products
            designed to nourish, strengthen and care for your hair.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-primary-brown/20 border-t-primary-thick animate-spin"
            />

            <p className="mt-4 text-sm text-gray-500">
              Loading products...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div
            className="rounded-2xl border border-primary-brown/20 bg-primary-background-lite py-16 px-6 text-center"
          >
            <ShoppingBag className="mx-auto w-10 h-10 text-primary-brown/50"/>

            <p className="mt-4 text-lg font-semibold text-primary-thick">
              No products available
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please check back later for our products.
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="space-y-8">
            {products.filter((product) => product.isActive).map((product) => {
                const quantity = getQuantity(product.id);

                return (
                  <div key={product.id}
                    className="group overflow-hidden rounded-3xl border border-primary-brown/15 bg-primary-background-lite shadow-sm transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col md:flex-row min-h-[420px]">

                      {/* ================= IMAGE ================= */}
                      <div className="relative w-full md:w-[45%] lg:w-[42%] min-h-[360px] md:min-h-[420px] bg-primary-background overflow-hidden flex items-center justify-center">
                        <img
                          src={product.product_image}
                          alt={product.product_name}
                          className="w-full h-full object-contain p-8 md:p-12 transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Image overlay */}
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-background-lite/20 pointer-events-none"
                        />
                      </div>

                      {/* ================= CONTENT ================= */}
                      <div className="flex flex-1 flex-col justify-center px-7 py-8 md:px-10 lg:px-14 md:py-10">

                        {/* Product Name */}
                        <h2 className="mt-5 text-3xl md:text-4xl font-serif font-semibold text-primary-thick">
                          {product.product_name}
                        </h2>

                        {/* Subheading */}
                        <p className="mt-2 text-base md:text-lg font-medium text-primary-brown">
                          {product.subheading} - {product.product_qty}
                        </p>

                        {/* Description */}
                        <p className="mt-5 max-w-xl text-sm md:text-base leading-7 text-gray-600">
                          {product.description}
                        </p>

                        {/* Divider */}
                        <div className="my-7 h-px w-full bg-primary-brown/10"/>

                        {/* Price */}
                        <div>
                          <p className="text-xs uppercase tracking-widest text-gray-500">
                            Price
                          </p>

                          <p
                            className="mt-1 text-3xl font-semibold text-primary-thick"
                          >
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </p>
                        </div>

                        {/* Shopping Controls */}
                        <div className="mt-7 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                          {/* Quantity */}
                          <div
                            className="flex items-center justify-between rounded-xl border border-primary-brown/20 bg-white h-12 px-2 w-full sm:w-[130px]"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(product.id)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-thick transition-colors hover:bg-primary-brown/10 cursor-pointer"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <span className="min-w-[30px] text-center font-semibold text-primary-thick">
                              {quantity}
                            </span>

                            <button type="button"
                              onClick={() => increaseQuantity(product.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-thick transition-colors hover:bg-primary-brown/10 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                         
                        </div>

                        {/* Quantity information */}
                        <p className="mt-4 text-xs text-gray-500">
                          {quantity} × ₹{Number(product.price).toLocaleString("en-IN")}
                          {" "} = ₹{(Number(product.price) * quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
             
          </div>
        )}
        <div className="mt-10 flex justify-end border-t border-primary-brown/10 pt-8">
          <button
            onClick={handleCreateUserModalOpen}
            disabled={orderPayload.order_details.length === 0}
            type="button"
            className="flex h-12 w-full sm:w-auto min-w-[200px] items-center justify-center gap-3 rounded-xl bg-primary-thick px-8 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Place Order</span>
            <ArrowRight className="h-4 w-4" />
          </button>
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
          onUserCreated={handleCreateOrder}
        />
        
      </div>
    </section>
  );
}