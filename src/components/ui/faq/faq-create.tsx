

"use client";

import { useState } from "react";
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
  createFAQ,
  updateFAQ,
  FAQ,
} from "@/app/(protected)/faq/action";

import { toast } from "sonner";

type CreateFAQPageParams = {
  faqDetails?: FAQ | null;
  mode?: string;
};

export default function CreateFAQPage({
  faqDetails,
  mode,
}: CreateFAQPageParams) {
  const router = useRouter();

  const isEditMode = mode === "edit";

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;

    /*
     * Make sure FAQ ID exists when editing.
     */
    if (isEditMode && !faqDetails?.id) {
      toast.error("FAQ ID is missing", {
        description: "Unable to update the FAQ.",
      });
      return;
    }

    /*
     * Create FormData.
     */
    const formData = new FormData(form);

    /*
     * Get field values.
     */
    const faqName = String(
      formData.get("faq_name") ?? ""
    ).trim();

    const faqQuestion = String(
      formData.get("faq_question") ?? ""
    ).trim();

    const faqAnswer = String(
      formData.get("faq_answer") ?? ""
    ).trim();

    /*
     * Validate FAQ Name.
     */
    if (!faqName) {
      toast.error("FAQ name is required", {
        description: "Please enter a name for the FAQ.",
      });
      return;
    }

    /*
     * Validate FAQ Name length.
     */
    if (faqName.length < 3) {
      toast.error("FAQ name is too short", {
        description:
          "FAQ name must contain at least 3 characters.",
      });
      return;
    }

    /*
     * Validate FAQ Question.
     */
    if (!faqQuestion) {
      toast.error("FAQ question is required", {
        description: "Please enter the FAQ question.",
      });
      return;
    }

    /*
     * Validate FAQ Question length.
     */
    if (faqQuestion.length < 5) {
      toast.error("FAQ question is too short", {
        description:
          "FAQ question must contain at least 5 characters.",
      });
      return;
    }

    /*
     * Validate FAQ Answer.
     */
    if (!faqAnswer) {
      toast.error("FAQ answer is required", {
        description: "Please enter the FAQ answer.",
      });
      return;
    }

    /*
     * Validate FAQ Answer length.
     */
    if (faqAnswer.length < 5) {
      toast.error("FAQ answer is too short", {
        description:
          "FAQ answer must contain at least 5 characters.",
      });
      return;
    }

    /*
     * Update FormData with trimmed values.
     */
    formData.set("faq_name", faqName);
    formData.set("faq_question", faqQuestion);
    formData.set("faq_answer", faqAnswer);

    setLoading(true);

    try {
      /*
       * UPDATE FAQ
       */
      if (isEditMode) {
        const result = await updateFAQ(
          formData,
          faqDetails!.id
        );

        if (result.success) {
          toast.success("FAQ updated successfully", {
            description:
              "The FAQ has been updated successfully.",
          });

          /*
           * Navigate back to FAQ list.
           */
          router.push("/faq");
        } else {
          toast.error("Failed to update FAQ", {
            description:
              result.error ||
              "Unable to update the FAQ.",
          });
        }
      }

      /*
       * CREATE FAQ
       */
      else {
        const result = await createFAQ(formData);

        if (result.success) {
          toast.success("FAQ created successfully", {
            description:
              "The new FAQ has been added successfully.",
          });

          /*
           * Reset form after successful creation.
           */
          form.reset();
        } else {
          toast.error("Failed to create FAQ", {
            description:
              result.error ||
              "Unable to create the FAQ.",
          });
        }
      }
    } catch (error) {
      console.error(
        isEditMode
          ? "Update FAQ error:"
          : "Create FAQ error:",
        error
      );

      toast.error(
        isEditMode
          ? "Something went wrong while updating"
          : "Something went wrong while creating",
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

  return (
    <div className="w-full space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isEditMode ? "Edit FAQ" : "Create FAQ"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? "Update the FAQ information below."
            : "Add a new FAQ to your website."}
        </p>
      </div>

      {/* Form */}
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>
            FAQ Information
          </CardTitle>

          <CardDescription>
            {isEditMode
              ? "Update the FAQ details below."
              : "Enter the details of your new FAQ below."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* FAQ Name */}
            <div className="space-y-2">
              <Label htmlFor="faq_name">
                FAQ Name
              </Label>

              <Input
                id="faq_name"
                name="faq_name"
                placeholder="Enter FAQ name"
                defaultValue={
                  isEditMode
                    ? faqDetails?.faq_name ?? ""
                    : ""
                }
                required
              />
            </div>

            {/* FAQ Question */}
            <div className="space-y-2">
              <Label htmlFor="faq_question">
                Question
              </Label>

              <Textarea
                id="faq_question"
                name="faq_question"
                placeholder="Enter the FAQ question..."
                className="min-h-[100px] resize-none"
                defaultValue={
                  isEditMode
                    ? faqDetails?.faq_question ?? ""
                    : ""
                }
                required
              />
            </div>

            {/* FAQ Answer */}
            <div className="space-y-2">
              <Label htmlFor="faq_answer">
                Answer
              </Label>

              <Textarea
                id="faq_answer"
                name="faq_answer"
                placeholder="Enter the answer..."
                className="min-h-[180px] resize-none"
                defaultValue={
                  isEditMode
                    ? faqDetails?.faq_answer ?? ""
                    : ""
                }
                required
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-6">

              {/* Cancel */}
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer text-black"
                onClick={() => router.push("/faq")}
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
                    ? "Update FAQ"
                    : "Create FAQ"}
              </Button>

            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
