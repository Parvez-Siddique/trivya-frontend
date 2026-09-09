import Navbar from "../main-componenets/navbar";
import OilUseSection from "@/main-componenets/oilusesection";
import BannerSection from "@/main-componenets/bannersection";
import HomeSection from "@/main-componenets/homesection";
import IngredientSection from "@/main-componenets/ingrediants";
import HowToUseSection from "@/main-componenets/howtouse";
import FooterSection from "@/main-componenets/footersection";
import FAQSection from "@/main-componenets/faqsection";
import { Toaster } from "@/components/ui/sonner";
import {getCustomerSession} from "@/lib/session";

export default async function Home() {

  const userSession = await getCustomerSession();

  return (
    <div className="flex flex-col min-h-screen bg-primary-background">
      <Navbar userSession={userSession}/>
      <OilUseSection userSession={userSession}/>
      <HomeSection/>
      <IngredientSection/>
      <HowToUseSection/>
      <FAQSection/>
      <BannerSection/>
      <FooterSection/>
      <Toaster />
    </div>
  );
}
