"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BestsellerProduct } from "@/types/dashboard";

interface OrderChartsProps {
  bestSellers: BestsellerProduct[];
}


const chartConfig = {
  quantity: {
    label: "จำนวนขาย",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function OrderCharts({ bestSellers }: OrderChartsProps) {
  const [timeRange, setTimeRange] = React.useState("30d");

  /**
   * แปลง bestseller -> [{ date, quantity }]
   * และรวมยอดในวันเดียวกัน
   */
  const chartData = React.useMemo(() => {
    const map: Record<string, number> = {};

    bestSellers.forEach((item) => {
      const dateKey = new Date(item.lastOrderDate)
        .toISOString()
        .split("T")[0]; // YYYY-MM-DD

      map[dateKey] = (map[dateKey] || 0) + item.totalQuantitySold;
    });

    return Object.entries(map)
      .map(([date, quantity]) => ({ date, quantity }))
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [bestSellers]);

  /**
   * filter ตามช่วงเวลา
   */
  const filteredData = React.useMemo(() => {
    const now = new Date();
    let days = 30;

    if (timeRange === "7d") days = 7;
    if (timeRange === "90d") days = 90;

    const startDate = new Date();
    startDate.setDate(now.getDate() - days);

    return chartData.filter(
      (item) => new Date(item.date) >= startDate
    );
  }, [chartData, timeRange]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>ยอดขายสินค้า</CardTitle>
          <CardDescription>
            แสดงจำนวนสินค้าที่ขายได้ตามช่วงเวลา
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[200px] rounded-lg">
            <SelectValue placeholder="เลือกช่วงเวลา" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 วันล่าสุด</SelectItem>
            <SelectItem value="30d">30 วันล่าสุด</SelectItem>
            <SelectItem value="90d">3 เดือนล่าสุด</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillQuantity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-quantity)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-quantity)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              type="natural"
              dataKey="quantity"
              fill="url(#fillQuantity)"
              stroke="var(--color-quantity)"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
