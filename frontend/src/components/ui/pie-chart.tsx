"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export function PieChartComponent({ data }: PieChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          "#FF6384", // Red
          "#36A2EB", // Blue
          "#FFCE56", // Yellow
          "#4BC0C0", // Teal
          "#9966FF", // Purple
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const value = tooltipItem.raw;
            return `${tooltipItem.label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center">
      <Pie data={chartData} options={options} />
    </div>
  );
}
