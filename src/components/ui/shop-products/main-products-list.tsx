
"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  getProductsPublicList,
  Product,
} from "@/app/(protected)/product/action";

type CartItem = {
  productId: number;
  variationId: number;
  product_count: number;
};

const CART_STORAGE_KEY = "trivya_cart";

export default function MainProducts({
  customerSession,
}: {
  customerSession?: any;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // =========================================================
  // GET CART COUNT
  // =========================================================

  const updateCartCount = () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedCart =
        sessionStorage.getItem(CART_STORAGE_KEY);

      if (!storedCart) {
        setCartCount(0);
        return;
      }

      const cart: CartItem[] = JSON.parse(storedCart);

      const totalCount = cart.reduce(
        (total, item) =>
          total + Number(item.product_count || 0),
        0
      );

      setCartCount(totalCount);
    } catch (error) {
      console.error(
        "Failed to read cart:",
        error
      );

      setCartCount(0);
    }
  };

  // =========================================================
  // GET PRODUCTS
  // =========================================================

  const getProductsList = async () => {
    try {
      setLoading(true);

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
      console.error(
        "Get products error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    getProductsList();
    updateCartCount();
  }, []);

  // =========================================================
  // UPDATE CART WHEN PAGE BECOMES VISIBLE
  // =========================================================

  useEffect(() => {
    const handleFocus = () => {
      updateCartCount();
    };

    const handleStorage = () => {
      updateCartCount();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  // =========================================================
  // SELECT PRODUCT
  // =========================================================

  const handleSelectProduct = (
    product: Product
  ) => {
    if (!product.id) {
      return;
    }

    router.push(
      `/shop-products?productId=${product.id}`
    );
  };

  // =========================================================
  // GET STARTING PRICE
  // =========================================================

  const getStartingPrice = (
    product: Product
  ) => {
    const variations =
      product.product_variations ?? [];

    if (variations.length === 0) {
      return null;
    }

    const prices = variations
      .map((variation) =>
        Number(variation.price_variation)
      )
      .filter(
        (price) =>
          !Number.isNaN(price) &&
          price >= 0
      );

    if (prices.length === 0) {
      return null;
    }

    return Math.min(...prices);
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
        bg-primary-background-lite
        px-3
        sm:px-5
        md:px-8
        lg:px-12
        xl:px-16
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

        <header
          className="
            shrink-0
            px-1
            pb-5
            pt-5
            sm:pb-7
            sm:pt-7
            md:px-2
            md:pb-8
            md:pt-9
          "
        >
          <div className="relative flex items-center justify-between">

            {/* ================================================= */}
            {/* BACK BUTTON */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() => router.back()}
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
                duration-200
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
                  duration-200
                  group-hover:-translate-x-1
                  sm:h-5
                  sm:w-5
                "
              />

              <span>Back</span>
            </button>

            {/* ================================================= */}
            {/* TITLE */}
            {/* ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                text-center
              "
            >
              <p
                className="
                  whitespace-nowrap
                  font-serif
                  text-2xl
                  font-medium
                  tracking-tight
                  text-primary-thick
                  sm:text-3xl
                  md:text-4xl
                  lg:text-[2.6rem]
                "
              >
                Shop Our Products
              </p>
            </div>

            {/* ================================================= */}
            {/* CART */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() => router.push("/cart")}
              aria-label="View cart"
              className="
                group
                relative
                flex
                h-10
                w-10
                cursor-pointer
                items-center
                justify-center
                rounded-full
                text-primary-thick
                transition-all
                duration-200
                hover:scale-105
                hover:bg-primary-brown/10
                sm:h-11
                sm:w-11
              "
            >
              <ShoppingCart
                className="
                  h-5
                  w-5
                  transition-transform
                  duration-200
                  group-hover:scale-105
                  sm:h-6
                  sm:w-6
                "
              />

              {/* CART BADGE */}

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-0.5
                    -top-1
                    flex
                    min-h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-primary-thick
                    px-1
                    text-[10px]
                    font-bold
                    leading-none
                    text-white
                    shadow-sm
                    ring-2
                    ring-primary-background-lite
                    sm:min-h-5.5
                    sm:min-w-5.5
                    sm:text-xs
                  "
                >
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* ================================================= */}
          {/* DESCRIPTION */}
          {/* ================================================= */}

          <div className="mt-5 text-center sm:mt-6">
            <p
              className="
                mx-auto
                max-w-xl
                text-xs
                leading-5
                text-gray-600
                sm:text-sm
                sm:leading-6
              "
            >
              Discover our carefully crafted
              natural care products made for
              your everyday hair-care routine.
            </p>
          </div>

          {/* ================================================= */}
          {/* DECORATIVE LINE */}
          {/* ================================================= */}

          <div
            className="
              mx-auto
              mt-5
              h-px
              w-16
              bg-primary-brown/20
              sm:mt-6
            "
          />
        </header>

        {/* ===================================================== */}
        {/* PRODUCTS SCROLL AREA */}
        {/* ===================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            pb-8
            pr-1
            sm:pb-10
            sm:pr-2
          "
        >
          {/* =================================================== */}
          {/* LOADING */}
          {/* =================================================== */}

          {loading && (
            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                lg:gap-5
              "
            >
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="
                      overflow-hidden
                      rounded-3xl
                      border
                      border-primary-brown/10
                      bg-white
                      shadow-sm
                    "
                  >
                    {/* IMAGE SKELETON */}

                    <div
                      className="
                        h-52
                        animate-pulse
                        bg-primary-background
                        sm:h-60
                      "
                    />

                    {/* CONTENT SKELETON */}

                    <div className="p-5">
                      <div
                        className="
                          h-5
                          w-3/4
                          animate-pulse
                          rounded
                          bg-primary-brown/10
                        "
                      />

                      <div
                        className="
                          mt-3
                          h-4
                          w-full
                          animate-pulse
                          rounded
                          bg-primary-brown/10
                        "
                      />

                      <div
                        className="
                          mt-2
                          h-4
                          w-2/3
                          animate-pulse
                          rounded
                          bg-primary-brown/10
                        "
                      />

                      <div
                        className="
                          mt-6
                          h-11
                          w-full
                          animate-pulse
                          rounded-xl
                          bg-primary-brown/10
                        "
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* =================================================== */}
          {/* EMPTY STATE */}
          {/* =================================================== */}

          {!loading &&
            products.length === 0 && (
              <div
                className="
                  flex
                  min-h-[360px]
                  items-center
                  justify-center
                  px-4
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
                    sm:px-10
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
                    <ShoppingBag
                      className="
                        h-7
                        w-7
                        text-primary-brown/60
                      "
                    />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-lg
                      font-semibold
                      text-primary-thick
                    "
                  >
                    No products available
                  </h3>

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
                    Our products will appear
                    here once they are available.
                    Please check back later.
                  </p>
                </div>
              </div>
            )}

          {/* =================================================== */}
          {/* PRODUCTS GRID */}
          {/* =================================================== */}

          {!loading &&
            products.length > 0 && (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  sm:gap-5
                  lg:grid-cols-3
                  lg:gap-6
                "
              >
                {products.map((product) => {
                  const startingPrice =
                    getStartingPrice(product);

                  return (
                    <article
                      key={product.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        handleSelectProduct(
                          product
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();

                          handleSelectProduct(
                            product
                          );
                        }
                      }}
                      className="
                        group
                        flex
                        cursor-pointer
                        flex-col
                        overflow-hidden
                        rounded-3xl
                        border
                        border-primary-brown/10
                        bg-white
                        shadow-sm
                        outline-none
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-primary-brown/25
                        hover:shadow-xl
                        focus-visible:ring-2
                        focus-visible:ring-primary-thick
                        focus-visible:ring-offset-2
                      "
                    >
                      {/* ======================================= */}
                      {/* IMAGE */}
                      {/* ======================================= */}

                      <div
                        className="
                          relative
                          h-56
                          overflow-hidden
                          bg-primary-background
                          sm:h-64
                        "
                      >
                        {/* Decorative circles */}

                        <div
                          className="
                            pointer-events-none
                            absolute
                            -right-12
                            -top-12
                            h-32
                            w-32
                            rounded-full
                            bg-primary-brown/5
                            blur-2xl
                          "
                        />

                        <div
                          className="
                            pointer-events-none
                            absolute
                            -bottom-16
                            -left-12
                            h-36
                            w-36
                            rounded-full
                            bg-primary-brown/5
                            blur-2xl
                          "
                        />

                        {/* Product image */}

                        {product.product_image ? (
                          <img
                            src={
                              product.product_image
                            }
                            alt={
                              product.product_name
                            }
                            className="
                              relative
                              z-10
                              h-full
                              w-full
                              object-contain
                              p-6
                              transition-transform
                              duration-500
                              ease-out
                              group-hover:scale-105
                              sm:p-8
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center
                              text-gray-400
                            "
                          >
                            <ShoppingBag
                              className="
                                h-10
                                w-10
                              "
                            />
                          </div>
                        )}

                        {/* PRODUCT BADGE */}

                        <div
                          className="
                            absolute
                            left-4
                            top-4
                            z-20
                            rounded-full
                            border
                            border-primary-brown/10
                            bg-white/90
                            px-3
                            py-1.5
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-primary-brown
                            shadow-sm
                            backdrop-blur-sm
                          "
                        >
                          Hair Care
                        </div>
                      </div>

                      {/* ======================================= */}
                      {/* CONTENT */}
                      {/* ======================================= */}

                      <div
                        className="
                          flex
                          flex-1
                          flex-col
                          p-5
                          sm:p-6
                        "
                      >
                        {/* PRODUCT NAME */}

                        <h2
                          className="
                            line-clamp-1
                            font-serif
                            text-xl
                            font-semibold
                            text-primary-thick
                            sm:text-2xl
                          "
                        >
                          {product.product_name}
                        </h2>

                        {/* SUBHEADING */}

                        <p
                          className="
                            mt-2
                            line-clamp-2
                            min-h-10
                            text-sm
                            leading-5
                            text-gray-500
                          "
                        >
                          {product.subheading}
                        </p>

                        {/* DIVIDER */}

                        <div
                          className="
                            my-5
                            h-px
                            w-full
                            bg-primary-brown/10
                          "
                        />

                        {/* PRICE + VARIATIONS */}

                        <div
                          className="
                            flex
                            items-end
                            justify-between
                            gap-3
                          "
                        >
                          <div>
                            <p
                              className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                text-gray-400
                              "
                            >
                              Starting from
                            </p>

                            <p
                              className="
                                mt-1
                                text-xl
                                font-bold
                                text-primary-thick
                              "
                            >
                              {startingPrice !==
                              null
                                ? `₹${startingPrice.toLocaleString(
                                    "en-IN"
                                  )}`
                                : "View price"}
                            </p>
                          </div>

                          {product.product_variations &&
                            product
                              .product_variations
                              .length > 0 && (
                              <span
                                className="
                                  whitespace-nowrap
                                  rounded-full
                                  bg-primary-background
                                  px-2.5
                                  py-1.5
                                  text-[10px]
                                  font-medium
                                  text-primary-brown
                                "
                              >
                                {
                                  product
                                    .product_variations
                                    .length
                                }{" "}
                                {product
                                  .product_variations
                                  .length ===
                                1
                                  ? "Size"
                                  : "Sizes"}
                              </span>
                            )}
                        </div>

                        {/* VIEW PRODUCT BUTTON */}

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            handleSelectProduct(
                              product
                            );
                          }}
                          className="
                            mt-5
                            flex
                            w-full
                            cursor-pointer
                            items-center
                            justify-between
                            rounded-xl
                            bg-primary-thick
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            duration-200
                            group-hover:shadow-md
                            hover:opacity-90
                          "
                        >
                          <span>
                            View Product
                          </span>

                          <ChevronRight
                            className="
                              h-4
                              w-4
                              transition-transform
                              duration-200
                              group-hover:translate-x-0.5
                            "
                          />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
