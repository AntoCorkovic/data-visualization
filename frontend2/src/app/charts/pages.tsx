import React from "react";
import { PieChartComponent } from "@/components/ui/pie-chart";

export default function ChartsPage() {
  const pieChartData = {
    labels: ["Red", "Blue", "Yellow", "Teal", "Purple"],
    values: [300, 50, 100, 150, 200],
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pie Chart Visualization</h1>
      <PieChartComponent data={pieChartData} />
    </div>
  );
}
