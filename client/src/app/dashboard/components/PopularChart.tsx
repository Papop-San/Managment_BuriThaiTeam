"use client";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TopProductTableItem, MonthlyPopularItem } from "@/types/dashboard";

interface PopularGraphProps {
  popularPieChart: TopProductTableItem[];
  popularBarchart: MonthlyPopularItem[];
}

const colors = ["#4f46e5", "#ec4899", "#10b981", "#f97316", "#3b82f6"];

export function ChartBarStackedTop5ByMonth({
  popularPieChart,
  popularBarchart,
}: PopularGraphProps) {

  // product names for bars
  const allProductNames = useMemo(() => {
    const set = new Set<string>();
    popularBarchart.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "month") set.add(key);
      });
    });
    return Array.from(set);
  }, [popularBarchart]);

  // bar chart data
  const chartData = useMemo(() => {
    return popularBarchart.map((item) => ({
      time: item.month,
      ...item,
    }));
  }, [popularBarchart]);

  // pie chart data
  const pieData = useMemo(() => {
    return popularPieChart.map((item) => ({
      name: item.productName,
      value: item.totalQuantity,
    }));
  }, [popularPieChart]);

  return (
    <Card className="mt-4">
      <CardHeader className="border-b py-5">
        <div className="grid gap-1">
          <CardTitle>Top 5 Products Sales</CardTitle>
          <CardDescription>
            Monthly stacked bar & overall top 5 distribution
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-row justify-center gap-10">
        {/* Bar Chart */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 1000 }}>
          <BarChart width={900} height={400} data={chartData} barCategoryGap={10}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" />
            <Tooltip />
            <Legend />
            {allProductNames.map((productName, index) => (
              <Bar
                key={productName}
                dataKey={productName}
                stackId="a"
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </div>

        {/* Pie Chart */}
        <div style={{ flexBasis: 350, flexShrink: 0 }}>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={140}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
}
