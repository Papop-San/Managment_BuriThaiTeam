"use client";

import * as React from "react";
import { OrderCharts } from "./OrderChart";
import { OrderTable } from "./OrderTable";



export function OrderDashBoard() {
  

  return (
    <div>
      <OrderCharts/>
      <OrderTable/>
    </div>
  );
}
