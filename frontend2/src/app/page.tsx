"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/ui/data-table";
import { PieChartComponent } from "@/components/ui/pie-chart"; // Import your PieChart component
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  const [currentView, setCurrentView] = useState("data-table"); // Default view is DataTable

  // Sample data for the pie chart
  const pieChartData = {
    labels: ["Red", "Blue", "Yellow", "Teal", "Purple"],
    values: [300, 50, 100, 150, 200],
  };

  // Function to dynamically render components based on the current view
  const renderView = () => {
    switch (currentView) {
      case "data-table":
        return <DataTable />;
      case "charts":
        return <PieChartComponent data={pieChartData} />; // Pass required data prop
      default:
        return <div className="text-center">Select a view from the sidebar.</div>;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar setCurrentView={setCurrentView} /> {/* Pass the setCurrentView function */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentView === "data-table" ? "Data Table" : "Charts"}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          <div className="w-full max-w-screen-2xl mx-auto flex-1 p-4">
            <div className="w-full overflow-hidden">
              {renderView()} {/* Dynamically render the component */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
