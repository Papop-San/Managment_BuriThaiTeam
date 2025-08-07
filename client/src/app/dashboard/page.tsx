import { SidebarComponent } from "@/app/components/Sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderDashBoard } from "./components/OrderDashBoard";

export default function DashboardPage() {
  return (
    <SidebarComponent>
      <div className="px-5">
        <div>
          <p className="text-3xl font-semibold ">Dashboard</p>
        </div>
        <div className="py-10 flex flex-wrap gap-13 justify-center">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs h-full max-h-full "
            >
              <CardHeader>
                <CardTitle>Icon</CardTitle>
                <div className="flex flex-col items-center">
                  <CardTitle className="text-2xl text-center">
                    Card Title
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div>
            <OrderDashBoard/>
        </div>
        <div>
            Table
        </div>
        <div>
          <div>Table</div>
          <div>graph</div>
        </div>
      </div>
    </SidebarComponent>
  );
}
