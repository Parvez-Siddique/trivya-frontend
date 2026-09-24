"use client";

import { useState, useEffect} from "react";
import {
  ImagePlus,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createProduct, Product, updateProduct} from "@/app/(protected)/product/action";
import { toast } from "sonner";


type VariationImage = {
  file: File | null;
  preview: string | null;
};


type ProductVariation = {
  size_variation: string;
  price_variation: string;

  variation_image_one: VariationImage;
  variation_image_two: VariationImage;
  variation_image_three: VariationImage;
  variation_image_four: VariationImage;
};


const createEmptyVariation = (): ProductVariation => ({
  size_variation: "",
  price_variation: "",

  variation_image_one: {
    file: null,
    preview: null,
  },

  variation_image_two: {
    file: null,
    preview: null,
  },

  variation_image_three: {
    file: null,
    preview: null,
  },

  variation_image_four: {
    file: null,
    preview: null,
  },
});

type CreateProductPageProps = {
  productDetails?: Product | null;
  mode?: "create" | "edit";
};


export default function CreateProductPage({
  productDetails,
  mode = "create",
}: CreateProductPageProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [productName, setProductName] = useState("");
  const [subheading, setSubheading] = useState("");
  const [description, setDescription] = useState("");

  // Main product image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Product variations
  const [variations, setVariations] = useState<ProductVariation[]>([
    createEmptyVariation(),
  ]);


  useEffect(() => {
  if (!productDetails || mode !== "edit") {
    return;
  }

  setProductName(productDetails.product_name);
  setSubheading(productDetails.subheading);
  setDescription(productDetails.description);

  setImageFile(null);
  setImagePreview(productDetails.product_image);

  // Main product image
  setImageFile(null);
  setImagePreview(productDetails.product_image);

  // Product variations
  if (
    productDetails.product_variations &&
    productDetails.product_variations.length > 0
  ) {
    const mappedVariations: ProductVariation[] =
      productDetails.product_variations.map((variation) => ({
        size_variation: variation.size_variation,
        price_variation: variation.price_variation,

        variation_image_one: {
          file: null,
          preview: variation.variation_image_one,
        },

        variation_image_two: {
          file: null,
          preview: variation.variation_image_two,
        },

        variation_image_three: {
          file: null,
          preview: variation.variation_image_three,
        },

        variation_image_four: {
          file: null,
          preview: variation.variation_image_four,
        },
      }));

    setVariations(mappedVariations);
  } else {
    setVariations([createEmptyVariation()]);
  }
}, [productDetails, mode]);


  /*
   * --------------------------------------------------
   * MAIN PRODUCT IMAGE
   * --------------------------------------------------
   */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid image format", {
        description:
          "Please upload a PNG, JPG, or JPEG image.",
      });

      event.target.value = "";
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };


  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };


  /*
   * --------------------------------------------------
   * VARIATION HANDLING
   * --------------------------------------------------
   */

  const handleVariationChange = (
    index: number,
    field: "size_variation" | "price_variation",
    value: string
  ) => {
    setVariations((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };


  const addVariation = () => {
    setVariations((previous) => [
      ...previous,
      createEmptyVariation(),
    ]);
  };


  const removeVariation = (index: number) => {
    if (variations.length === 1) {
      toast.error("At least one variation is required.");
      return;
    }

    setVariations((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };


  /*
   * --------------------------------------------------
   * VARIATION IMAGE HANDLING
   * --------------------------------------------------
   */

  const handleVariationImageChange = (
    variationIndex: number,
    imageField:
      | "variation_image_one"
      | "variation_image_two"
      | "variation_image_three"
      | "variation_image_four",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid image format", {
        description:
          "Please upload a PNG, JPG, or JPEG image.",
      });

      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setVariations((previous) => {
      const updated = [...previous];

      updated[variationIndex] = {
        ...updated[variationIndex],
        [imageField]: {
          file,
          preview: previewUrl,
        },
      };

      return updated;
    });
  };


  const removeVariationImage = (
    variationIndex: number,
    imageField:
      | "variation_image_one"
      | "variation_image_two"
      | "variation_image_three"
      | "variation_image_four"
  ) => {
    setVariations((previous) => {
      const updated = [...previous];

      updated[variationIndex] = {
        ...updated[variationIndex],
        [imageField]: {
          file: null,
          preview: null,
        },
      };

      return updated;
    });
  };


  /*
   * --------------------------------------------------
   * RESET
   * --------------------------------------------------
   */

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);

    setVariations([
      createEmptyVariation(),
    ]);
  };


  /*
   * --------------------------------------------------
   * SUBMIT
   * --------------------------------------------------
   */

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const form = event.currentTarget;

  if (!imageFile && !imagePreview) {
    toast.error("Product image is required", {
      description: "Please upload the main product image.",
    });

    return;
  }

  const productNameValue = productName.trim();
  const subheadingValue = subheading.trim();
  const descriptionValue = description.trim();

  /*
   * Validate product fields
   */
  if (!productNameValue) {
    toast.error("Product name is required.");
    return;
  }

  if (!subheadingValue) {
    toast.error("Product subheading is required.");
    return;
  }

  if (!descriptionValue) {
    toast.error("Product description is required.");
    return;
  }

  /*
   * Validate variations
   */
  if (variations.length === 0) {
    toast.error("Variation required", {
      description: "Please add at least one product variation.",
    });

    return;
  }

  for (let index = 0; index < variations.length; index++) {
    const variation = variations[index];

    const sizeValue = variation.size_variation.trim();
    const priceValue = variation.price_variation.trim();

    if (!sizeValue) {
      toast.error(
        `Size is required for variation ${index + 1}.`
      );

      return;
    }

    if (!priceValue) {
      toast.error(
        `Price is required for variation ${index + 1}.`
      );

      return;
    }

    const numericPrice = Number(priceValue);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      toast.error(
        `Invalid price for variation ${index + 1}.`
      );

      return;
    }
  }

  /*
   * Product data
   */
  const productData = {
    product_name: productNameValue,
    subheading: subheadingValue,
    description: descriptionValue,
    isActive: productDetails?.isActive ?? true,
  };

  /*
   * Variation data
   */
  const productVariationData = variations.map(
    (variation) => ({
      size_variation: variation.size_variation.trim(),
      price_variation: variation.price_variation.trim(),
    })
  );

  /*
   * Build FormData
   */
  const requestFormData = new FormData();

  requestFormData.append(
    "product_data",
    JSON.stringify(productData)
  );

  requestFormData.append(
    "product_variation_data",
    JSON.stringify(productVariationData)
  );

  /*
   * Main product image
   *
   * Only append when a new image has been selected.
   * In edit mode, if no new image is selected,
   * backend can retain the existing image.
   */
  if (imageFile instanceof File) {
    requestFormData.append(
      "product_image",
      imageFile
    );
  }

  /*
   * Variation images
   */
  variations.forEach(
    (variation, variationIndex) => {
      const variationNumber = variationIndex + 1;

      const imageFields = [
        {
          field: "variation_image_one",
          file: variation.variation_image_one?.file,
        },
        {
          field: "variation_image_two",
          file: variation.variation_image_two?.file,
        },
        {
          field: "variation_image_three",
          file: variation.variation_image_three?.file,
        },
        {
          field: "variation_image_four",
          file: variation.variation_image_four?.file,
        },
      ];

      imageFields.forEach(({ field, file }) => {
        if (file instanceof File) {
          requestFormData.append(
            `variation_${variationNumber}_${field}`,
            file
          );
        }
      });
    }
  );

  /*
   * Submit
   */
  setLoading(true);

  try {
    /*
     * EDIT
     */
    if (mode === "edit") {
      if (!productDetails?.id) {
        toast.error("Product ID is missing", {
          description:
            "Unable to update the product without a valid product ID.",
        });

        return;
      }

      const result = await updateProduct(
        requestFormData,
        productDetails.id
      );

      if (result.success) {
        toast.success(
          "Product updated successfully",
          {
            description:
              "The product has been updated successfully.",
          }
        );

        router.push("/product");
      } else {
        toast.error(
          "Failed to update product",
          {
            description:
              result.error ||
              "Unable to update the product.",
          }
        );
      }

      return;
    }

    /*
     * CREATE
     */
    const result = await createProduct(
      requestFormData
    );

    if (result.success) {
      toast.success(
        "Product created successfully",
        {
          description:
            "The new product has been added to your store.",
        }
      );

      resetForm();
      form.reset();

      router.push("/product");
    } else {
      toast.error(
        "Failed to create product",
        {
          description:
            result.error ||
            "Unable to create the product.",
        }
      );
    }
  } catch (error) {
    console.error(
      "Product submission error:",
      error
    );

    toast.error(
      "Something went wrong",
      {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      }
    );
  } finally {
    setLoading(false);
  }
};



  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div className="w-full space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "edit" ? "Edit Product" : "Create Product"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {mode === "edit"
            ? "Update the product details and its size variations."
            : "Add a new product and its size variations."}
        </p>
      </div>


      {/* Form */}

      <Card className="w-full md:w-2/3 lg:w-1/2">

        <CardHeader>

          <CardTitle>
            Product Information
          </CardTitle>

          <CardDescription>
            Enter the product details and add
            its available size variations.
          </CardDescription>

        </CardHeader>


        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* -------------------------------- */}
            {/* Product Name */}
            {/* -------------------------------- */}

            <div className="space-y-2">

              <Label htmlFor="product_name">
                Product Name
              </Label>

              <Input
                id="product_name"
                name="product_name"
                placeholder="Enter product name"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                required
              />

            </div>


            {/* -------------------------------- */}
            {/* Subheading */}
            {/* -------------------------------- */}

            <div className="space-y-2">

              <Label htmlFor="subheading">
                Subheading
              </Label>

             <Input
                id="subheading"
                name="subheading"
                placeholder="Enter product subheading"
                value={subheading}
                onChange={(event) => setSubheading(event.target.value)}
                required
              />

            </div>


            {/* -------------------------------- */}
            {/* Description */}
            {/* -------------------------------- */}

            <div className="space-y-2">

              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                name="description"
                placeholder="Describe your product..."
                className="min-h-[140px] resize-none"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />

            </div>


            {/* -------------------------------- */}
            {/* Main Product Image */}
            {/* -------------------------------- */}

            <div className="space-y-2">

              <Label>
                Product Image
              </Label>

              {!imagePreview ? (

                <label
                  htmlFor="product_image"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition hover:border-muted-foreground/50"
                >

                  <ImagePlus
                    className="mb-3 h-10 w-10 text-muted-foreground"
                  />

                  <p className="text-sm font-medium">
                    Click to upload product image
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG or JPEG
                  </p>

                  <Input
                    id="product_image"
                    name="product_image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={
                      handleImageChange
                    }
                  />

                </label>

              ) : (

                <div className="relative overflow-hidden rounded-lg border">

                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-[300px] w-full object-contain bg-muted"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-3 top-3"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                </div>

              )}

            </div>


            {/* -------------------------------- */}
            {/* Product Variations */}
            {/* -------------------------------- */}

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div>

                  <Label>
                    Product Variations
                  </Label>

                  <p className="text-xs text-muted-foreground">
                    Add size, price and optional
                    variation images.
                  </p>

                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariation}
                  disabled={loading}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Variation
                </Button>

              </div>


              {/* Variation cards */}

              <div className="space-y-6">

                {variations.map(
                  (variation, variationIndex) => (

                    <Card
                      key={variationIndex}
                      className="border-muted-foreground/20"
                    >

                      <CardHeader className="pb-4">

                        <div className="flex items-center justify-between">

                          <CardTitle className="text-base">
                            Variation{" "}
                            {variationIndex + 1}
                          </CardTitle>

                          {variations.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                removeVariation(
                                  variationIndex
                                )
                              }
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}

                        </div>

                      </CardHeader>


                      <CardContent className="space-y-5">

                        {/* Size */}

                        <div className="space-y-2">

                          <Label>
                            Size Variation
                          </Label>

                          <Input
                            value={
                              variation.size_variation
                            }
                            onChange={(event) =>
                              handleVariationChange(
                                variationIndex,
                                "size_variation",
                                event.target.value
                              )
                            }
                            placeholder="Example: 100ml"
                            disabled={loading}
                          />

                        </div>


                        {/* Price */}

                        <div className="space-y-2">

                          <Label>
                            Price
                          </Label>

                          <div className="relative">

                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              ₹
                            </span>

                            <Input
                              value={
                                variation.price_variation
                              }
                              onChange={(event) =>
                                handleVariationChange(
                                  variationIndex,
                                  "price_variation",
                                  event.target.value
                                )
                              }
                              type="text"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-8"
                              disabled={loading}
                            />

                          </div>

                        </div>


                        {/* Variation Images */}

                        <div className="space-y-3">

                          <div>

                            <Label>
                              Variation Images
                            </Label>

                            <p className="text-xs text-muted-foreground">
                              Upload up to four
                              optional images for
                              this variation.
                            </p>

                          </div>


                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {(
                              [
                                "variation_image_one",
                                "variation_image_two",
                                "variation_image_three",
                                "variation_image_four",
                              ] as const
                            ).map(
                              (
                                imageField,
                                imageIndex
                              ) => {

                                const image =
                                  variation[
                                    imageField
                                  ];

                                return (

                                  <div
                                    key={imageField}
                                    className="space-y-2"
                                  >

                                    <Label>
                                      Variation Image{" "}
                                      {imageIndex + 1}
                                    </Label>


                                    {!image.preview ? (

                                      <label
                                        htmlFor={`variation_${variationIndex}_${imageField}`}
                                        className="flex h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition hover:border-muted-foreground/50"
                                      >

                                        <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />

                                        <p className="text-xs font-medium">
                                          Upload image
                                        </p>

                                        <Input
                                          id={`variation_${variationIndex}_${imageField}`}
                                          type="file"
                                          accept="image/png,image/jpeg,image/jpg"
                                          className="hidden"
                                          onChange={(
                                            event
                                          ) =>
                                            handleVariationImageChange(
                                              variationIndex,
                                              imageField,
                                              event
                                            )
                                          }
                                        />

                                      </label>

                                    ) : (

                                      <div className="relative overflow-hidden rounded-lg border">

                                        <img
                                          src={
                                            image.preview
                                          }
                                          alt={`Variation ${
                                            variationIndex +
                                            1
                                          } image ${
                                            imageIndex +
                                            1
                                          }`}
                                          className="h-[160px] w-full object-contain bg-muted"
                                        />

                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          className="absolute right-2 top-2"
                                          onClick={() =>
                                            removeVariationImage(
                                              variationIndex,
                                              imageField
                                            )
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>

                                      </div>

                                    )}

                                  </div>

                                );
                              }
                            )}

                          </div>

                        </div>

                      </CardContent>

                    </Card>

                  )
                )}

              </div>

            </div>


            {/* -------------------------------- */}
            {/* Actions */}
            {/* -------------------------------- */}

            <div className="flex justify-end gap-3 border-t pt-6">

              <Button
                type="button"
                variant="outline"
                className="cursor-pointer text-black"
                onClick={() =>
                  router.push("/product")
                }
                disabled={loading}
              >
                Cancel
              </Button>


              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer bg-primary-thick text-white hover:bg-primary-thick/90"
              >
                {loading
                  ? "Creating..."
                  : "Create Product"}
              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  );
}