
"use client";

import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { getPublicFAQList, FAQ } from "@/app/(protected)/faq/action";

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleFAQ = (id: number) => {
    setOpenFAQ((current) =>
      current === id ? null : id
    );
  };

  const getFAQList = async () => {
    try {
      const response = await getPublicFAQList({
        page: 0,
        page_size: 10,
      });

      if (response.success) {
        setFaqs(response.data ?? []);
      } else {
        console.error(
          "Failed to fetch FAQs:",
          response.error
        );
      }
    } catch (error) {
      console.error("Get FAQ error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFAQList();
  }, []);

  return (
    <section id="faqSection" className="relative w-full px-6 md:px-12 lg:px-20 py-16 overflow-hidden">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-black">
            Frequently Asked Questions
          </p>

          <p className="mt-3 text-sm md:text-base text-gray-600">
            Find answers to some of the most common questions
            about Trivya Hair Oil.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">
              Loading FAQs...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && faqs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">
              No FAQs available.
            </p>
          </div>
        )}

        {/* FAQ List */}
        {!loading && faqs.length > 0 && (
          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = openFAQ === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`
                    overflow-hidden rounded-xl
                    border border-primary-brown/20
                    bg-primary-background-lite
                    transition-all duration-300 ease-out
                    ${isOpen
                      ? "shadow-sm"
                      : "shadow-none"
                    }
                  `}
                >

                  {/* Question */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleFAQ(faq.id)
                    }
                    className="
                      w-full flex items-center
                      justify-between gap-4
                      px-5 py-5 text-left
                      cursor-pointer
                      transition-colors duration-200
                      hover:bg-primary-brown/5
                    "
                  >
                    <span
                      className="
                        text-base md:text-lg
                        font-semibold
                        text-primary-thick
                      "
                    >
                      {faq.faq_question}
                    </span>

                    {/* Icon */}
                    <span
                      className="
                        flex-shrink-0
                        flex items-center
                        justify-center
                        w-8 h-8
                        rounded-full
                        bg-primary-thick
                        text-white
                      "
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {/* Animated Answer */}
                  <div
                    className={`
                      grid
                      transition-[grid-template-rows,opacity]
                      duration-300 ease-out
                      ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }
                    `}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5">
                        <div className="border-t border-primary-brown/10 pt-4">
                          <p
                            className={`text-md md:text-base leading-7 text-gray-600
                              transition-transform duration-300 ease-out font-bold
                              ${isOpen ? "translate-y-0" : "-translate-y-2"}`}
                          >
                            {faq.faq_answer}
                          </p>
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
    </section>
  );
}
