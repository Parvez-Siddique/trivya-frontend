"use client";

import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TopNavbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
      </div>
      
    </header>
  );
}