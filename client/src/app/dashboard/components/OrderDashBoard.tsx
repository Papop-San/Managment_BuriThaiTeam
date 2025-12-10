"use client";

import * as React from "react";
import { OrderCharts } from "./OrderChart";
import { OrderTable } from "./OrderTable";
import { BestsellerProduct } from "@/types/dashboard"; 

interface OrderDashBoardProps {
  bestSellers: BestsellerProduct[];
}



export function OrderDashBoard({ bestSellers }: OrderDashBoardProps) {
  return (
    <div>
      <OrderCharts bestSellers={bestSellers} />
      <OrderTable bestSellers={bestSellers}/>
    </div>
  );
}
