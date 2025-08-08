"use client";

import * as React from "react";
import { PopularTable } from "./PopularTable";
import { ChartBarStackedTop5ByMonth } from "./PopularChart";



export function PopularDashBoard() {
  return (
    <div>
      <ChartBarStackedTop5ByMonth/>
      <PopularTable/>
    </div>
  );
}
