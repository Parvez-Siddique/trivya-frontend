import {AppSidebar} from "@/components/ui/app-sidebar";
import TopNavbar from "@/components/ui/navbar";
import { getSession } from "@/lib/session";
import {redirect} from "next/navigation"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {Toaster} from "@/components/ui/sonner";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getSession();

  if (!user) { 
    redirect("/login"); 
  }

  if (user?.user_type !== "ADMIN") {
      redirect("/login");
    }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <TopNavbar />
        <main className="flex-1 p-6">
          {children}

          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}