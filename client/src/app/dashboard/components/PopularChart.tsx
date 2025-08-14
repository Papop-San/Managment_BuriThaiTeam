"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type PopularInterface = {
  id: number;
  productName: string;
  categoryName: string;
  quantity: number;
  left_quantity: number;
  status_product: "in_stock" | "out_of_stock" | "low_stock";
  date: Date;
};

export const popularProductsMock: PopularInterface[] = [
  // ข้อมูลเดิม 14 รายการ (กรกฎาคม - กันยายน 2025)
  {
    id: 1,
    productName: "iPhone 15 Pro Max",
    categoryName: "Smartphone",
    quantity: 120,
    left_quantity: 80,
    status_product: "in_stock",
    date: new Date("2025-07-15"),
  },
  //... (ข้อมูลเดิมที่คุณให้มา)

  // เดือนตุลาคม 2025
  {
    id: 15,
    productName: "iPhone 15 Pro Max",
    categoryName: "Smartphone",
    quantity: 140,
    left_quantity: 90,
    status_product: "in_stock",
    date: new Date("2025-10-05"),
  },
  //... (ข้อมูลที่คุณให้มา)

  // เดือนพฤศจิกายน 2025
  {
    id: 20,
    productName: "PlayStation 5",
    categoryName: "Gaming Console",
    quantity: 40,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2025-11-01"),
  },
  //... (ข้อมูลที่คุณให้มา)

  // เดือนธันวาคม 2025
  {
    id: 25,
    productName: "iPhone 15 Pro Max",
    categoryName: "Smartphone",
    quantity: 150,
    left_quantity: 95,
    status_product: "in_stock",
    date: new Date("2025-12-05"),
  },
  {
    id: 26,
    productName: "Samsung Galaxy S24 Ultra",
    categoryName: "Smartphone",
    quantity: 120,
    left_quantity: 10,
    status_product: "low_stock",
    date: new Date("2025-12-10"),
  },
  {
    id: 27,
    productName: "Sony WH-1000XM5",
    categoryName: "Headphones",
    quantity: 60,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2025-12-15"),
  },
  {
    id: 28,
    productName: "MacBook Air M3",
    categoryName: "Laptop",
    quantity: 90,
    left_quantity: 70,
    status_product: "in_stock",
    date: new Date("2025-12-20"),
  },
  {
    id: 29,
    productName: "Dell XPS 15",
    categoryName: "Laptop",
    quantity: 50,
    left_quantity: 7,
    status_product: "low_stock",
    date: new Date("2025-12-25"),
  },

  // เดือนมกราคม 2026
  {
    id: 30,
    productName: "PlayStation 5",
    categoryName: "Gaming Console",
    quantity: 45,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2026-01-05"),
  },
  {
    id: 31,
    productName: "Nintendo Switch OLED",
    categoryName: "Gaming Console",
    quantity: 70,
    left_quantity: 55,
    status_product: "in_stock",
    date: new Date("2026-01-10"),
  },
  {
    id: 32,
    productName: "Apple Watch Series 9",
    categoryName: "Wearable",
    quantity: 100,
    left_quantity: 4,
    status_product: "low_stock",
    date: new Date("2026-01-15"),
  },
  {
    id: 33,
    productName: "Logitech MX Master 3S",
    categoryName: "Accessories",
    quantity: 170,
    left_quantity: 170,
    status_product: "in_stock",
    date: new Date("2026-01-20"),
  },
  {
    id: 34,
    productName: "Kindle Paperwhite",
    categoryName: "E-Reader",
    quantity: 45,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2026-01-25"),
  },

  // เดือนกุมภาพันธ์ 2026
  {
    id: 35,
    productName: "iPhone 15 Pro Max",
    categoryName: "Smartphone",
    quantity: 155,
    left_quantity: 100,
    status_product: "in_stock",
    date: new Date("2026-02-05"),
  },
  {
    id: 36,
    productName: "Samsung Galaxy S24 Ultra",
    categoryName: "Smartphone",
    quantity: 125,
    left_quantity: 12,
    status_product: "low_stock",
    date: new Date("2026-02-10"),
  },
  {
    id: 37,
    productName: "Sony WH-1000XM5",
    categoryName: "Headphones",
    quantity: 65,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2026-02-15"),
  },
  {
    id: 38,
    productName: "MacBook Air M3",
    categoryName: "Laptop",
    quantity: 95,
    left_quantity: 75,
    status_product: "in_stock",
    date: new Date("2026-02-20"),
  },
  {
    id: 39,
    productName: "Dell XPS 15",
    categoryName: "Laptop",
    quantity: 55,
    left_quantity: 10,
    status_product: "low_stock",
    date: new Date("2026-02-25"),
  },

  // เดือนมีนาคม 2026
  {
    id: 40,
    productName: "PlayStation 5",
    categoryName: "Gaming Console",
    quantity: 50,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2026-03-05"),
  },
  {
    id: 41,
    productName: "Nintendo Switch OLED",
    categoryName: "Gaming Console",
    quantity: 75,
    left_quantity: 60,
    status_product: "in_stock",
    date: new Date("2026-03-10"),
  },
  {
    id: 42,
    productName: "Apple Watch Series 9",
    categoryName: "Wearable",
    quantity: 105,
    left_quantity: 5,
    status_product: "low_stock",
    date: new Date("2026-03-15"),
  },
  {
    id: 43,
    productName: "Logitech MX Master 3S",
    categoryName: "Accessories",
    quantity: 180,
    left_quantity: 180,
    status_product: "in_stock",
    date: new Date("2026-03-20"),
  },
  {
    id: 44,
    productName: "Kindle Paperwhite",
    categoryName: "E-Reader",
    quantity: 50,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2026-03-25"),
  },

  // เดือนเมษายน 2026
  {
    id: 45,
    productName: "iPhone 15 Pro Max",
    categoryName: "Smartphone",
    quantity: 160,
    left_quantity: 110,
    status_product: "in_stock",
    date: new Date("2026-04-05"),
  },
  {
    id: 46,
    productName: "Samsung Galaxy S24 Ultra",
    categoryName: "Smartphone",
    quantity: 130,
    left_quantity: 15,
    status_product: "low_stock",
    date: new Date("2026-04-10"),
  },
  {
    id: 47,
    productName: "Sony WH-1000XM5",
    categoryName: "Headphones",
    quantity: 70,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2026-04-15"),
  },
  {
    id: 48,
    productName: "MacBook Air M3",
    categoryName: "Laptop",
    quantity: 100,
    left_quantity: 80,
    status_product: "in_stock",
    date: new Date("2026-04-20"),
  },
  {
    id: 49,
    productName: "Dell XPS 15",
    categoryName: "Laptop",
    quantity: 60,
    left_quantity: 12,
    status_product: "low_stock",
    date: new Date("2026-04-25"),
  },

  // เดือนพฤษภาคม 2026
  {
    id: 50,
    productName: "PlayStation 5",
    categoryName: "Gaming Console",
    quantity: 55,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2026-05-05"),
  },
  {
    id: 51,
    productName: "Nintendo Switch OLED",
    categoryName: "Gaming Console",
    quantity: 80,
    left_quantity: 65,
    status_product: "in_stock",
    date: new Date("2026-05-10"),
  },
  {
    id: 52,
    productName: "Apple Watch Series 9",
    categoryName: "Wearable",
    quantity: 110,
    left_quantity: 7,
    status_product: "low_stock",
    date: new Date("2026-05-15"),
  },
  {
    id: 53,
    productName: "Logitech MX Master 3S",
    categoryName: "Accessories",
    quantity: 190,
    left_quantity: 190,
    status_product: "in_stock",
    date: new Date("2026-05-20"),
  },
  {
    id: 54,
    productName: "Kindle Paperwhite",
    categoryName: "E-Reader",
    quantity: 55,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2026-05-25"),
  },

  // เดือนมิถุนายน 2026
  {
    id: 55,
    productName: "iPhone 15 Pro Max",
    categoryName: "Smartphone",
    quantity: 165,
    left_quantity: 120,
    status_product: "in_stock",
    date: new Date("2026-06-05"),
  },
  {
    id: 56,
    productName: "Samsung Galaxy S24 Ultra",
    categoryName: "Smartphone",
    quantity: 135,
    left_quantity: 18,
    status_product: "low_stock",
    date: new Date("2026-06-10"),
  },
  {
    id: 57,
    productName: "Sony WH-1000XM5",
    categoryName: "Headphones",
    quantity: 75,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2026-06-15"),
  },
  {
    id: 58,
    productName: "MacBook Air M3",
    categoryName: "Laptop",
    quantity: 105,
    left_quantity: 85,
    status_product: "in_stock",
    date: new Date("2026-06-20"),
  },
  {
    id: 59,
    productName: "Dell XPS 15",
    categoryName: "Laptop",
    quantity: 65,
    left_quantity: 15,
    status_product: "low_stock",
    date: new Date("2026-06-25"),
  },
];

function formatMonth(date: Date) {
  return date.toISOString().slice(0, 7); 
}
function formatYear(date: Date) {
  return date.toISOString().slice(0, 4); 
}
function getSoldQuantity(p: PopularInterface) {
  return p.quantity - p.left_quantity;
}
// หา Top 5 Product ตามยอดขายรวม
const totalSalesByProduct: Record<string, number> = {};
popularProductsMock.forEach((p) => {
  totalSalesByProduct[p.productName] =
    (totalSalesByProduct[p.productName] || 0) + getSoldQuantity(p);
});
const top5Products = Object.entries(totalSalesByProduct)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([productName]) => productName);

const colors = ["#4f46e5", "#ec4899", "#10b981", "#f97316", "#3b82f6"];

export function ChartBarStackedTop5ByMonth() {
  const [filterBy, setFilterBy] = useState<"month" | "year">("month");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { chartData, pieData } = useMemo(() => {
    if (!mounted) {
      // ยังไม่ mounted ให้ return ข้อมูลว่างก่อน
      return { chartData: [], pieData: [] };
    }

    const monthlyDataMap: Record<string, Record<string, number>> = {};
    const yearlyDataMap: Record<string, Record<string, number>> = {};

    popularProductsMock.forEach((p) => {
      if (!top5Products.includes(p.productName)) return;

      const month = formatMonth(p.date);
      const year = formatYear(p.date);
      const sold = getSoldQuantity(p);

      if (!monthlyDataMap[month]) monthlyDataMap[month] = {};
      if (!monthlyDataMap[month][p.productName])
        monthlyDataMap[month][p.productName] = 0;
      monthlyDataMap[month][p.productName] += sold;

      if (!yearlyDataMap[year]) yearlyDataMap[year] = {};
      if (!yearlyDataMap[year][p.productName])
        yearlyDataMap[year][p.productName] = 0;
      yearlyDataMap[year][p.productName] += sold;
    });

    const dataMap = filterBy === "month" ? monthlyDataMap : yearlyDataMap;

    const chartDataLocal = Object.entries(dataMap)
      .sort(([a], [b]) => a.localeCompare(b)) // เรียงลำดับ key (เดือน/ปี)
      .map(([time, products]) => ({
        time,
        ...products,
      }));

    const pieDataLocal: { name: string; value: number }[] = top5Products.map(
      (productName) => {
        const total = Object.values(dataMap).reduce(
          (sum, productMap) => sum + (productMap[productName] || 0),
          0
        );
        return { name: productName, value: total };
      }
    );

    return { chartData: chartDataLocal, pieData: pieDataLocal };
  }, [filterBy, mounted]);
  if (!mounted) {
    return null; 
  }

  return (
    <Card className="mt-4">
      <CardHeader  className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
      <div className="grid flex-1 gap-1">
          
          <CardTitle>
            Top 5 Products Sales by {filterBy === "month" ? "Month" : "Year"}
          </CardTitle>
         <CardDescription>
            Stacked bar chart by product, grouped by {filterBy}
          </CardDescription>
        </div>

        <Select value={filterBy} onValueChange={(value) => setFilterBy(value as "month" | "year")}>
  <SelectTrigger className="w-[160px] rounded-lg border border-gray-300">
    <SelectValue placeholder="Select filter" />
  </SelectTrigger>
  <SelectContent className="w-[160px] rounded-lg">
    <SelectItem value="month">By Month</SelectItem>
    <SelectItem value="year">By Year</SelectItem>
  </SelectContent>
</Select>
      </CardHeader>

      <CardContent className="flex flex-row gap-20 justify-center">
        {/* Bar chart */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 800 }}>
          <BarChart
            key={filterBy}
            width={900}
            height={400}
            data={chartData}
            barCategoryGap={10}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" /> {/* แก้จาก month เป็น time */}
            <Tooltip
              wrapperStyle={{ whiteSpace: "nowrap" }}
              contentStyle={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
                padding: 8,
              }}
            />
            <Legend />
            {top5Products.map((productName, index) => (
              <Bar
                key={`${productName}-${index}`}
                dataKey={productName}
                stackId="a"
                fill={colors[index]}
                radius={
                  index === 0
                    ? [4, 4, 0, 0]
                    : index === top5Products.length - 1
                    ? [0, 0, 4, 4]
                    : 0
                }
              />
            ))}
          </BarChart>
        </div>

        {/* Pie chart */}
        <div style={{ flexBasis: 350, flexShrink: 0 }}>
          <PieChart width={700} height={400}>
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
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
}
