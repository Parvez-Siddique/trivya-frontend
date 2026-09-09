
"use client";


import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
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

import {
  createProduct,
  updateProduct,
  Product,
} from "@/app/(protected)/product/action";

import { toast } from "sonner";

type CreatePageParams = {
  productDetails?: Product | null;
  mode?: string;
};

export default function CreateProductPage({
  productDetails,
  mode,
}: CreatePageParams) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /*
   * Set existing product image when editing.
   */
  useEffect(() => {
    if (isEditMode && productDetails) {
      setImagePreview(productDetails.product_image || null);
    } else {
      setImagePreview(null);
    }
  }, [isEditMode, productDetails]);

  /*
   * Handle product image selection.
   */
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Optional file type validation
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid image format", {
        description: "Please upload a PNG, JPG, or JPEG image.",
      });

      event.target.value = "";
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  /*
   * Remove selected product image.
   */
  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  /*
   * Handle form submission.
   */
 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    /*
    * Product ID is required for edit.
    */
    if (isEditMode && !productDetails?.id) {
      toast.error("Product ID is missing", {
        description: "Unable to update the product.",
      });
      return;
    }

    /*
    * Image is required only when creating.
    *
    * During edit, the existing image can be kept
    * without selecting a new image.
    */
    if (!isEditMode && !imageFile) {
      toast.error("Product image is required", {
        description: "Please upload a product image.",
      });
      return;
    }

    /*
    * Create FormData from the form.
    */
    const formData = new FormData(form);

    /*
    * Product image handling.
    */
    if (imageFile) {
      formData.set("product_image", imageFile);
    } else if (isEditMode) {
      /*
      * If editing and no new image was selected,
      * don't send product_image.
      *
      * This allows Django to retain the existing image.
      */
      formData.delete("product_image");
    }

    /*
    * Validate price.
    */
    const price = Number(
      formData.get("price")
    );

    if (
      Number.isNaN(price) ||
      price < 0
    ) {
      toast.error("Invalid product price", {
        description: "Please enter a valid product price.",
      });
      return;
    }

    setLoading(true);

    try {
      /*
      * UPDATE PRODUCT
      */
      if (isEditMode) {
        const result = await updateProduct(
          formData,
          productDetails!.id
        );

        if (result.success) {
          toast.success("Product updated successfully", {
            description:
              "The product details have been updated successfully.",
          });

          /*
          * Clear selected new image.
          */
          setImageFile(null);

          /*
          * Keep the current/existing image preview.
          */
          if (productDetails?.product_image) {
            setImagePreview(
              productDetails.product_image
            );
          }

          /*
          * Navigate back to product list.
          */
          router.push("/product");
        } else {
          toast.error("Failed to update product", {
            description:
              result.error ||
              "Unable to update the product.",
          });
        }
      }

      /*
      * CREATE PRODUCT
      */
      else {
        const result = await createProduct(formData);

        if (result.success) {
          toast.success("Product created successfully", {
            description:
              "The new product has been added to your store.",
          });

          /*
          * Reset form.
          */
          form.reset();

          /*
          * Reset image state.
          */
          setImageFile(null);
          setImagePreview(null);
        } else {
          toast.error("Failed to create product", {
            description:
              result.error ||
              "Unable to create the product.",
          });
        }
      }
    } catch (error) {
      console.error(
        "Product submission error:",
        error
      );

      toast.error("Something went wrong", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while processing the request.",
      });
    } finally {
      setLoading(false);
    }
  };

  /*
   * Handle cancel.
   */
  const handleCancel = () => {
    setImageFile(null);

    if (isEditMode) {
      setImagePreview(
        productDetails?.product_image ?? null
      );
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="w-full space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isEditMode ? "Edit Product" : "Create Product"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? "Update the product information below."
            : "Add a new product to your store."}
        </p>
      </div>

      {/* Form Card */}
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>
            Product Information
          </CardTitle>

          <CardDescription>
            {isEditMode
              ? "Update the product details below."
              : "Enter the details of your new product below."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="product_name">
                Product Name
              </Label>

              <Input
                id="product_name"
                name="product_name"
                placeholder="Enter product name"
                defaultValue={
                  isEditMode
                    ? productDetails?.product_name ?? ""
                    : ""
                }
                required
              />
            </div>

            {/* Subheading */}
            <div className="space-y-2">
              <Label htmlFor="subheading">
                Subheading
              </Label>

              <Input
                id="subheading"
                name="subheading"
                placeholder="Enter product subheading"
                defaultValue={
                  isEditMode
                    ? productDetails?.subheading ?? ""
                    : ""
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                name="description"
                placeholder="Describe your product..."
                className="min-h-[140px] resize-none"
                defaultValue={
                  isEditMode
                    ? productDetails?.description ?? ""
                    : ""
                }
                required
              />
            </div>

            {/* Product Quantity */}
            <div className="space-y-2">
              <Label htmlFor="product_qty">
                Product Quantity
              </Label>

              <Input
                id="product_qty"
                name="product_qty"
                type="text"
                min="1"
                step="1"
                placeholder="Enter product quantity"
                defaultValue={
                  isEditMode
                    ? productDetails?.product_qty ?? ""
                    : ""
                }
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Price
              </Label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ₹
                </span>

                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0.00"
                  className="pl-8"
                  defaultValue={
                    isEditMode
                      ? productDetails?.price ?? ""
                      : ""
                  }
                  required
                />
              </div>
            </div>

            {/* Product Image */}
            <div className="space-y-2">
              <Label htmlFor="product_image">
                Product Image
              </Label>

              {!imagePreview ? (
                <label
                  htmlFor="product_image"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition hover:border-muted-foreground/50"
                >
                  <ImagePlus className="mb-3 h-10 w-10 text-muted-foreground" />

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
                    onChange={handleImageChange}
                    required={!isEditMode}
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

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-6">

              {/* Cancel */}
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer text-black"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer bg-primary-thick text-white hover:bg-primary-thick/90"
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Product"
                  : "Create Product"}
              </Button>

            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
