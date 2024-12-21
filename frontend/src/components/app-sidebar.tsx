"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";

interface AppSidebarProps {
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

// Sample data with no nested items.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Import Data",
      view: "data-table",
      icon: SquareTerminal,
    },
    {
      title: "Charts",
      view: "charts",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ setCurrentView }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation */}
        <nav className="space-y-2">
          {data.navMain.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentView(item.view)} // Change the current view
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent w-full text-left"
            >
              <item.icon className="size-5" />
              <span>{item.title}</span>
            </button>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
