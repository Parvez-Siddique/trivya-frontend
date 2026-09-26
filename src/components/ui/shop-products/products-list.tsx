
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ImageOff,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type {
  Product,
  ProductVariation,
} from "@/app/(public)/shop-products/action";

type CartItem = {
  productId: number;
  variationId: number;
  product_count: number;
};

const CART_STORAGE_KEY = "trivya_cart";

export default function ShopProducts({
  customerSession,
  productDetails,
}: {
  customerSession?: any;
  productDetails: Product;
}) {
  const router = useRouter();

  const product = productDetails;

  // =========================================================
  // SELECTED VARIATION
  // =========================================================

  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(
      product.product_variations?.[0] ?? null
    );

  // =========================================================
  // CART COUNT
  // =========================================================

  const [cartCount, setCartCount] = useState<number>(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    try {
      const storedCart =
        sessionStorage.getItem(CART_STORAGE_KEY);

      if (!storedCart) {
        return 0;
      }

      const cart: CartItem[] = JSON.parse(storedCart);

      return cart.reduce(
        (total, item) =>
          total + Number(item.product_count || 0),
        0
      );
    } catch {
      return 0;
    }
  });

  const [isAdded, setIsAdded] = useState(false);

  // =========================================================
  // IMAGE GALLERY
  // =========================================================

  const galleryImages = useMemo(() => {
    const images: string[] = [];

    // -------------------------------------------------------
    // MAIN PRODUCT IMAGE
    // -------------------------------------------------------

    if (product.product_image) {
      images.push(product.product_image);
    }

    // -------------------------------------------------------
    // SELECTED VARIATION IMAGES
    // -------------------------------------------------------

    if (selectedVariation) {
      const variationImages = [
        selectedVariation.variation_image_one,
        selectedVariation.variation_image_two,
        selectedVariation.variation_image_three,
        selectedVariation.variation_image_four,
      ];

      variationImages.forEach((image) => {
        if (image && !images.includes(image)) {
          images.push(image);
        }
      });
    }

    return images;
  }, [product.product_image, selectedVariation]);

  // =========================================================
  // CURRENT MAIN IMAGE
  // =========================================================

  const [selectedImage, setSelectedImage] = useState<string>(
    product.product_image
  );

  // =========================================================
  // CHANGE MAIN IMAGE WHEN VARIATION CHANGES
  // =========================================================

  useEffect(() => {
    if (!selectedVariation) {
      setSelectedImage(product.product_image);
      return;
    }

    const firstVariationImage =
      selectedVariation.variation_image_one ||
      selectedVariation.variation_image_two ||
      selectedVariation.variation_image_three ||
      selectedVariation.variation_image_four;

    setSelectedImage(
      firstVariationImage || product.product_image
    );
  }, [selectedVariation, product.product_image]);

  // =========================================================
  // SAFETY
  // =========================================================

  useEffect(() => {
    if (
      selectedImage &&
      galleryImages.includes(selectedImage)
    ) {
      return;
    }

    setSelectedImage(
      galleryImages[0] || product.product_image
    );
  }, [
    galleryImages,
    selectedImage,
    product.product_image,
  ]);

  // =========================================================
  // SELECT VARIATION
  // =========================================================

  const handleVariationSelect = (
    variation: ProductVariation
  ) => {
    setSelectedVariation(variation);
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const addToCart = () => {
    if (!product.id) {
      return;
    }

    if (!selectedVariation?.id) {
      return;
    }

    try {
      const storedCart =
        sessionStorage.getItem(CART_STORAGE_KEY);

      const cart: CartItem[] = storedCart
        ? JSON.parse(storedCart)
        : [];

      const productId = Number(product.id);
      const variationId = Number(selectedVariation.id);

      const existingItemIndex = cart.findIndex(
        (item) =>
          item.productId === productId &&
          item.variationId === variationId
      );

      // =====================================================
      // INCREASE COUNT
      // =====================================================

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].product_count += 1;
      }

      // =====================================================
      // ADD NEW ITEM
      // =====================================================

      else {
        cart.push({
          productId,
          variationId,
          product_count: 1,
        });
      }

      // =====================================================
      // SAVE CART
      // =====================================================

      sessionStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );

      // =====================================================
      // CALCULATE TOTAL CART QUANTITY
      // =====================================================

      const totalCount = cart.reduce(
        (total, item) =>
          total + Number(item.product_count || 0),
        0
      );

      setCartCount(totalCount);

      // =====================================================
      // SHOW ADDED ANIMATION
      // =====================================================

      setIsAdded(true);

      setTimeout(() => {
        setIsAdded(false);
      }, 1200);
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );
    }
  };

  // =========================================================
  // PRICE
  // =========================================================

  const selectedPrice = selectedVariation?.price_variation ?? "";

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <section
      id="productDetailsSection"
      className="
        relative
        h-dvh
        w-full
        overflow-hidden
        px-3
        sm:px-5
        md:px-8
        lg:px-10
        xl:px-14
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
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

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
            md:pt-9
          "
        >
          <div className="relative flex min-h-9 items-center">

            {/* BACK */}

            <button
              type="button"
              onClick={() => router.back()}
              className="
                group
                flex
                cursor-pointer
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

            {/* TITLE */}

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
              "
            >
              Product Details
            </p>

            {/* CART */}

            <button
              type="button"
              onClick={() => router.push("/cart")}
              aria-label="View cart"
              className="
                group
                relative
                ml-auto
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
                  sm:h-6
                  sm:w-6
                "
              />

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
        </div>

        {/* ================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            pb-32
            pr-1
            sm:pb-36
            sm:pr-2
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              overflow-hidden
              rounded-2xl
              border
              border-primary-brown/15
              bg-primary-background-lite
              shadow-sm
              sm:rounded-3xl
            "
          >
            <div
              className="
                flex
                flex-col
                lg:flex-row
              "
            >

              {/* ================================================= */}
              {/* PRODUCT GALLERY */}
              {/* ================================================= */}

              <div
                className="
                  w-full
                  bg-primary-background
                  lg:w-[58%]
                "
              >
                <div
                  className="
                    relative
                    flex
                    min-h-[430px]
                    w-full
                    flex-col
                    overflow-hidden
                    p-4
                    sm:min-h-[550px]
                    sm:p-6
                    md:min-h-[620px]
                    md:p-8
                    lg:min-h-[700px]
                    lg:p-10
                  "
                >
                  {/* Decorative background */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -left-24
                      -top-24
                      h-72
                      w-72
                      rounded-full
                      bg-primary-brown/5
                      blur-3xl
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -bottom-24
                      -right-24
                      h-72
                      w-72
                      rounded-full
                      bg-primary-brown/5
                      blur-3xl
                    "
                  />

                  {/* ================================================= */}
                  {/* MAIN IMAGE */}
                  {/* ================================================= */}

                  <div
                    className="
                      relative
                      z-10
                      flex
                      min-h-0
                      flex-1
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl
                      border
                      border-primary-brown/10
                      bg-white
                      shadow-sm
                      sm:rounded-3xl
                    "
                  >
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt={product.product_name}
                        className="
                          h-full
                          max-h-[520px]
                          w-full
                          object-contain
                          p-5
                          transition-all
                          duration-300
                          sm:p-8
                          md:p-10
                          lg:p-12
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-gray-400
                        "
                      >
                        <ImageOff className="h-5 w-5" />
                        No image available
                      </div>
                    )}

                    {/* Image counter */}

                    {galleryImages.length > 0 && (
                      <div
                        className="
                          absolute
                          bottom-4
                          right-4
                          rounded-full
                          bg-black/55
                          px-3
                          py-1.5
                          text-[10px]
                          font-medium
                          text-white
                          backdrop-blur-sm
                          sm:bottom-5
                          sm:right-5
                        "
                      >
                        {galleryImages.indexOf(
                          selectedImage
                        ) + 1}{" "}
                        / {galleryImages.length}
                      </div>
                    )}
                  </div>

                  {/* ================================================= */}
                  {/* THUMBNAILS */}
                  {/* ================================================= */}

                  {galleryImages.length > 0 && (
                    <div
                      className="
                        relative
                        z-10
                        mt-4
                        flex
                        w-full
                        gap-3
                        overflow-x-auto
                        pb-1
                        scrollbar-thin
                        sm:mt-5
                        sm:gap-4
                      "
                    >
                      {galleryImages.map(
                        (image, index) => {
                          const isSelected =
                            selectedImage === image;

                          return (
                            <button
                              key={`${image}-${index}`}
                              type="button"
                              onClick={() =>
                                setSelectedImage(
                                  image
                                )
                              }
                              aria-label={`View product image ${
                                index + 1
                              }`}
                              className={`
                                relative
                                h-20
                                w-20
                                shrink-0
                                cursor-pointer
                                overflow-hidden
                                rounded-xl
                                border-2
                                bg-white
                                transition-all
                                duration-200
                                sm:h-24
                                sm:w-24
                                sm:rounded-2xl
                                ${
                                  isSelected
                                    ? "border-primary-thick shadow-md ring-2 ring-primary-thick/10"
                                    : "border-primary-brown/10 hover:border-primary-brown/30 hover:shadow-sm"
                                }
                              `}
                            >
                              <img
                                src={image}
                                alt={`${product.product_name} thumbnail ${
                                  index + 1
                                }`}
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  p-2
                                  sm:p-2.5
                                "
                              />

                              {/* Selected indicator */}

                              {isSelected && (
                                <span
                                  className="
                                    absolute
                                    bottom-1.5
                                    right-1.5
                                    flex
                                    h-5
                                    w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-primary-thick
                                    text-white
                                  "
                                >
                                  <Check className="h-3 w-3" />
                                </span>
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ================================================= */}
              {/* PRODUCT DETAILS */}
              {/* ================================================= */}

              <div
                className="
                  flex
                  w-full
                  flex-col
                  px-5
                  py-7
                  sm:px-7
                  sm:py-9
                  md:px-10
                  md:py-10
                  lg:w-[42%]
                  lg:px-12
                  lg:py-12
                  xl:px-14
                "
              >
                {/* CATEGORY */}

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-primary-brown/70
                    sm:text-xs
                  "
                >
                  Hair Care
                </p>

                {/* PRODUCT NAME */}

                <h1
                  className="
                    mt-2
                    font-serif
                    text-3xl
                    font-semibold
                    leading-tight
                    text-primary-thick
                    sm:text-4xl
                    md:text-5xl
                  "
                >
                  {product.product_name}
                </h1>

                {/* SUBHEADING */}

                <p
                  className="
                    mt-2
                    text-sm
                    font-medium
                    text-primary-brown
                    sm:text-base
                    md:text-lg
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
                    sm:my-7
                  "
                />

                {/* DESCRIPTION */}

                <div>
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-gray-500
                      sm:text-xs
                    "
                  >
                    Description
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-600
                      sm:text-base
                      sm:leading-7
                    "
                  >
                    {product.description}
                  </p>
                </div>

                {/* ================================================= */}
                {/* SIZE VARIATIONS */}
                {/* ================================================= */}

                <div className="mt-7 sm:mt-9">
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-gray-500
                        sm:text-xs
                      "
                    >
                      Select Size
                    </p>

                    {selectedVariation && (
                      <p
                        className="
                          text-xs
                          font-semibold
                          text-primary-brown
                          sm:text-sm
                        "
                      >
                        {selectedVariation.size_variation}
                      </p>
                    )}
                  </div>

                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-2.5
                      sm:gap-3
                    "
                  >
                    {product.product_variations?.map(
                      (variation, index) => {
                        const isSelected =
                          selectedVariation?.id
                            ? selectedVariation.id ===
                              variation.id
                            : selectedVariation ===
                              variation;

                        return (
                          <button
                            key={
                              variation.id ??
                              `${variation.size_variation}-${index}`
                            }
                            type="button"
                            onClick={() =>
                              handleVariationSelect(
                                variation
                              )
                            }
                            className={`
                              cursor-pointer
                              rounded-xl
                              border
                              px-4
                              py-2.5
                              text-sm
                              font-semibold
                              transition-all
                              duration-200
                              ${
                                isSelected
                                  ? "border-primary-thick bg-primary-thick text-white shadow-sm"
                                  : "border-primary-brown/20 bg-white text-primary-thick hover:border-primary-brown/40 hover:bg-primary-background"
                              }
                            `}
                          >
                            {variation.size_variation}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* ================================================= */}
                {/* PRICE */}
                {/* ================================================= */}

                <div
                  className="
                    mt-7
                    rounded-2xl
                    border
                    border-primary-brown/10
                    bg-white/70
                    p-4
                    sm:mt-8
                    sm:p-5
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-gray-500
                      sm:text-xs
                    "
                  >
                    Price
                  </p>

                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className="
                        text-lg
                        font-medium
                        text-primary-thick
                        sm:text-xl
                      "
                    >
                      ₹
                    </span>

                    <span
                      className="
                        text-3xl
                        font-bold
                        text-primary-thick
                        sm:text-4xl
                      "
                    >
                      {selectedPrice
                        ? Number(
                            selectedPrice
                          ).toLocaleString("en-IN")
                        : "—"}
                    </span>
                  </div>

                  {selectedVariation && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-gray-500
                      "
                    >
                      For{" "}
                      {selectedVariation.size_variation}
                    </p>
                  )}

                  {/* TOTAL */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      border-t
                      border-primary-brown/10
                      pt-4
                    "
                  >
                    <span
                      className="
                        text-sm
                        font-medium
                        text-gray-600
                      "
                    >
                      Total Price
                    </span>

                    <span
                      className="
                        text-base
                        font-bold
                        text-primary-thick
                        sm:text-lg
                      "
                    >
                      {selectedPrice
                        ? `₹${Number(
                            selectedPrice
                          ).toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* ================================================= */}
                {/* SELECTED VARIATION IMAGE INFO */}
                {/* ================================================= */}

                {selectedVariation && (
                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-gray-500
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-primary-thick
                      "
                    />

                    Showing images for{" "}
                    <span className="font-semibold text-primary-thick">
                      {selectedVariation.size_variation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FLOATING ADD TO CART BUTTON */}
      {/* ========================================================= */}

      <div
        className="
          pointer-events-none
          fixed
          bottom-5
          left-0
          right-0
          z-50
          flex
          justify-center
          px-4
          sm:bottom-7
        "
      >
        <button
          type="button"
          onClick={addToCart}
          disabled={!selectedVariation?.id}
          className={`
            pointer-events-auto
            flex
            w-full
            max-w-md
            cursor-pointer
            items-center
            justify-between
            gap-4
            rounded-2xl
            px-5
            py-3.5
            text-white
            shadow-xl
            shadow-black/15
            transition-all
            duration-300
            sm:px-6
            sm:py-4

            ${
              isAdded
                ? "scale-[1.02] bg-green-600"
                : "bg-primary-thick hover:-translate-y-0.5 hover:shadow-2xl"
            }

            disabled:cursor-not-allowed
            disabled:opacity-50
          `}
        >
          <div className="flex items-center gap-2.5">
            {isAdded ? (
              <Check
                className="
                  h-5
                  w-5
                  animate-bounce
                "
              />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}

            <span className="text-sm font-semibold sm:text-base">
              {isAdded
                ? "Added to Cart"
                : "Add to Cart"}
            </span>
          </div>

          <span className="text-base font-bold sm:text-lg">
            {selectedPrice
              ? `₹${Number(
                  selectedPrice
                ).toLocaleString("en-IN")}`
              : "—"}
          </span>
        </button>
      </div>
    </section>
  );
}
