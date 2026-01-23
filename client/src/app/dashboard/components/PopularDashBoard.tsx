"use client";

import * as React from "react";
import { PopularTable } from "./PopularTable";
import { ChartBarStackedTop5ByMonth } from "./PopularChart";
import { PopularData } from "@/types/dashboard";


interface PopularDashBoardProps {
  popularSeller: PopularData | null;
}

export function PopularDashBoard({ popularSeller }: PopularDashBoardProps) {
  return (
    <div>
      <ChartBarStackedTop5ByMonth  
        popularBarchart={popularSeller?.Top5PopularMonthlyBarChart ?? []}
        popularPieChart={popularSeller?.Top5PopularChart ?? []} />
      <PopularTable  topTable={popularSeller?.TablePopular??[]} />
    </div>
  );
}
