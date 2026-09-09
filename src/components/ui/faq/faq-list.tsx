"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import Datatable, {
  Column,
  Pagination,
} from "@/components/ui/datatable";

import {
  FAQ,
  getFAQ,
  handleFAQDelete,
} from "@/app/(protected)/faq/action";

type FAQListProps = {
  faqList: FAQ[];
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
};

export default function FAQList({
  faqList,
  pagination,
  onPageChange,
}: FAQListProps) {
  const router = useRouter();

  const [faqListData, setFaqListData] = useState<FAQ[]>(faqList);

  const fetchData = async () => {
    const response = await getFAQ({
      page: 0,
      page_size: 10,
    });

    setFaqListData(response?.data ?? []);
  };

  const handleEdit = (faq: FAQ) => {
    router.push(`/faq/create/${faq.id}`);
  };

  const handleDelete = async (faqId: number) => {
    const response = await handleFAQDelete(faqId);

    if (response.success) {
      fetchData();
    }
  };

  const handleCreate = () => {
    router.push("/faq/create");
  };

  const columns: Column<FAQ>[] = [
    {
      key: "faq_name",
      title: "FAQ Name",
      render: (value) => (
        <span className="font-medium">
          {String(value || "-")}
        </span>
      ),
    },

    {
      key: "faq_question",
      title: "Question",
      render: (value) => (
        <span className="line-clamp-2 max-w-[350px]">
          {String(value || "-")}
        </span>
      ),
    },

    {
      key: "faq_answer",
      title: "Answer",
      render: (value) => (
        <span className="line-clamp-2 max-w-[450px]">
          {String(value || "-")}
        </span>
      ),
    },

    {
      title: "Actions",
      render: (_, faq) => (
        <div className="flex items-center gap-2">

          {/* Edit */}
          <button
            type="button"
            onClick={() => handleEdit(faq)}
            className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-gray-100 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => handleDelete(faq.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md border text-red-500 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>

        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            FAQs
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage your frequently asked questions.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer"
            onClick={handleCreate}
          >
            Create New FAQ
          </button>
        </div>

      </div>

      {/* FAQ Table */}
      <Datatable
        data={faqListData}
        columns={columns}
        pagination={pagination}
        onPageChange={onPageChange}
        emptyMessage="No FAQs found."
      />

    </div>
  );
}