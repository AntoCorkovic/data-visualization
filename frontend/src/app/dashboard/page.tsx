"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/ui/data-table";
import { PieChartComponent } from "@/components/ui/pie-chart";

export default function Page() {
  const [currentView, setCurrentView] = useState("data-table"); // Default view: DataTable

  // Sample data for PieChartComponent
  const pieChartData = {
    labels: ["Red", "Blue", "Yellow", "Teal", "Purple"],
    values: [300, 50, 100, 150, 200],
  };

  // Function to render the view dynamically
  const renderView = () => {
    switch (currentView) {
      case "data-table":
        return <DataTable />;
      case "charts":
        return <PieChartComponent data={pieChartData} />; // Pass data prop here
      default:
        return <div>Select a view from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AppSidebar setCurrentView={setCurrentView} />
      
      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {renderView()}
      </div>
    </div>
  );
}
