"use client";

import {
  Package,
  ShoppingCart,
  CircleQuestionMark,
  Settings,
  CircleUser,
  LogOut
} from "lucide-react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { logoutUser } from "@/app/(public)/login/action";

const menuItems = [
  {
    title: "Products",
    url: "/product",
    icon: Package,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "FAQ",
    url: "/faq",
    icon: CircleQuestionMark,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: CircleUser,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];


const handleAdminLogout = async () => {
  try {
    const result = await logoutUser();

    if (result) {
      toast.success("Logged out successfully");
    } else {
      toast.error("Failed to logout");
    }
  } catch (error) {
    toast.error("An error occurred during logout");
  }
};



export function AppSidebar() {
  return (
    <Sidebar>
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center h-full">
            <img
              src="/product/sidebar-image.png"
              alt="Trivya"
              className="h-16 w-auto object-contain"
            />
          </div>
      </div>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <a
                      href={item.url}
                      className="flex w-full flex-row items-center gap-3"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                handleAdminLogout();
              }}
              className="w-full cursor-pointer"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}