import { getFAQDetails } from "@/app/(protected)/faq/action";
import CreateFAQPage from "@/components/ui/faq/faq-create";

async function fetchFAQDetails(faqId: string) {
  const response = await getFAQDetails({faq_id: parseInt(faqId, 10)});

  if (response.success) {
    return response.data;
  }

  console.error("Failed to fetch product details:", response.error);
  return null;
}

export default async function Page({params}: {
    params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const faqDetails = await fetchFAQDetails(id);
  
  return <CreateFAQPage faqDetails={faqDetails} mode={"edit"} />;
}