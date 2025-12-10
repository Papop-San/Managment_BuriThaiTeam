"use client";

import { useState, useEffect } from "react";
import { SidebarComponent } from "@/app/components/Sidebar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderDashBoard } from "./components/OrderDashBoard";
import { PopularDashBoard } from "./components/PopularDashBoard";
import { DashboardResponse, DashboardData } from "@/types/dashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data: DashboardResponse = await res.json();
      setDashboardData(data.data);
      console.log(data);
    } catch (err) {
      console.error("fetch:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const dashboardCards = dashboardData
  ? [
      {
        title: "คำสั่งซื้อทั้งหมด",
        value: dashboardData.totalOrders ?? 0,
        icon: "📦",
      },
      {
        title: "รอดำเนินการ",
        value: dashboardData.pendingOrdersCount ?? 0, 
        icon: "⏳",
      },
      {
        title: "ผู้ใช้งานทั้งหมด",
        value: dashboardData.totalUsers ?? 0,
        icon: "👤",
      },
      {
        title: "รายได้รวม",
        value: `$${dashboardData.totalRevenue ?? 0}`,
        icon: "💰",
      },
      {
        title: "สถานะเว็บไซต์",
        value: dashboardData.websiteStatus ?? "ไม่ทราบ",
        icon: "🌐",
      },
    ]
  : [
      { title: "จำนวนคำสั่งซื้อทั้งหมด", value: "-", icon: "📦" },
      { title: "จำนวนคำสั่งซื้อที่รอดำเนินการ", value: "-", icon: "⏳" },
      { title: "จำนวนผู้ใช้งานทั้งหมด", value: "-", icon: "👤" },
      { title: "รายได้รวม", value: "-", icon: "💰" },
      { title: "สถานะเว็บไซต์", value: "-", icon: "🌐" },
    ];


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SidebarComponent>
      <Card>
        <div className="px-5">
          <div className="text-center ">
            <p className="text-4xl font-semibold ">Dashboard</p>
          </div>
          <div className="py-10 flex flex-row gap-6 justify-center flex-nowrap overflow-x-auto">
          {dashboardCards.map((card, i) => (
              <Card
                key={i}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs h-full max-h-full"
              >
                <CardHeader>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-row items-center gap-4 pb-2">
                      <p className="text-5xl">{card.icon}</p>
                      <CardTitle className="text-xl">{card.title}</CardTitle>
                    </div>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div>
            <OrderDashBoard
              bestSellers={dashboardData?.bestseller ?? []}
            />
          </div>
          <div>
            <PopularDashBoard />
          </div>
        </div>
      </Card>
    </SidebarComponent>
  );
}
