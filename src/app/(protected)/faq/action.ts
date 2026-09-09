"use server";

import { serverAPI } from "@/lib/serverAPI";

/* =========================
   FAQ Types
========================= */

export type CreateFAQData = {
  faq_name: string;
  faq_question: string;
  faq_answer: string;
};

export type FAQ = {
  id: number;
  faq_name: string;
  faq_question: string;
  faq_answer: string;
};

export type FAQListParams = {
  page?: number;
  page_size?: number;
};


/* =========================
   Create FAQ
========================= */

export async function createFAQ(formData: FormData) {
  try {
    const data = await serverAPI<{ status: string }>(
      "/faq/create/",
      {
        method: "POST",
        body: formData,
      }
    );

    return {
      success: data.status === "SUCCESS",
      data,
    };

  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
}


/* =========================
   Get FAQ List
========================= */

export async function getFAQ(params: FAQListParams = {}) {
  try {
    const faqs = await serverAPI<FAQ[]>("/faq/list/",
      {
        method: "GET",
        params,
      }
    );

    return {
      success: true,
      data: faqs,
    };

  } catch (error) {
    console.error("Get FAQ error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch FAQs",
    };
  }
}


/* =========================
   Get FAQ Details
========================= */

export async function getFAQDetails({
  faq_id,
}: {
  faq_id: number;
}) {
  try {
    const faq = await serverAPI<FAQ>(
      "/faq/getFAQ/",
      {
        method: "GET",
        params: {
          faq_id,
        },
      }
    );

    return {
      success: true,
      data: faq,
    };

  } catch (error) {
    console.error("Get FAQ details error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch FAQ",
    };
  }
}


/* =========================
   Update FAQ
========================= */

export async function updateFAQ(
  formData: FormData,
  faq_id: number
) {
  try {
    const data = await serverAPI<{ status: string }>(
      "/faq/update/",
      {
        method: "PUT",
        params: {
          faq_id,
        },
        body: formData,
      }
    );

    return {
      success: data.status === "SUCCESS",
      data,
      error:
        data.status === "SUCCESS"
          ? undefined
          : "FAQ update failed",
    };

  } catch (error) {
    console.error("updateFAQ error:", error);

    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : String(error),
    };
  }
}


/* =========================
   Delete FAQ
========================= */

export async function handleFAQDelete(
  faqId: number
) {
  try {
    const data = await serverAPI<{ status: string }>(
      `/faq/delete/?faq_id=${faqId}`,
      {
        method: "DELETE",
      }
    );

    return {
      success: data.status === "SUCCESS",
    };

  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
}



export async function getPublicFAQList(params: FAQListParams = {}) {
  try {
    const faqs = await serverAPI<FAQ[]>("/faq/faq-public-list/",
      {
        method: "GET",
        params,
      }
    );

    return {
      success: true,
      data: faqs,
    };

  } catch (error) {
    console.error("Get FAQ error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch FAQs",
    };
  }
}
