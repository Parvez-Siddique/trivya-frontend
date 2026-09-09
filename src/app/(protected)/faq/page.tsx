import FAQList from "@/components/ui/faq/faq-list";
import { getFAQ } from "@/app/(protected)/faq/action";

const getFAQList = async (params: {
  page: number;
  page_size: number;
}) => { 
  const response = await getFAQ(params);
  return response;
};

export default async function Page() {
  const response = await getFAQList({
    page: 1,
    page_size: 10,
  });

  return <FAQList faqList={response.data ?? []} />;
}