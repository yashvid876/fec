import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  AlertTriangle,
  PackageCheck,
  Truck,
  ArrowRightLeft,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentActivities = [
  { id: 1, type: "Receipt", reference: "RCP-001", product: "Steel Rods", quantity: 50, status: "completed", date: "2025-11-20" },
  { id: 2, type: "Delivery", reference: "DLV-001", product: "Office Chairs", quantity: 10, status: "pending", date: "2025-11-21" },
  { id: 3, type: "Transfer", reference: "TRF-001", product: "Laptops", quantity: 5, status: "in_progress", date: "2025-11-22" },
  { id: 4, type: "Adjustment", reference: "ADJ-001", product: "Steel Rods", quantity: -3, status: "completed", date: "2025-11-22" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your inventory overview.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Quick Action
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Products"
            value="1,234"
            icon={Package}
            trend={{ value: 12, isPositive: true }}
            variant="default"
          />
          <StatCard
            title="Low Stock Items"
            value="23"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Pending Receipts"
            value="8"
            icon={PackageCheck}
            variant="default"
          />
          <StatCard
            title="Pending Deliveries"
            value="15"
            icon={Truck}
            variant="default"
          />
          <StatCard
            title="Transfers Scheduled"
            value="5"
            icon={ArrowRightLeft}
            variant="success"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.type}</TableCell>
                      <TableCell className="text-muted-foreground">{activity.reference}</TableCell>
                      <TableCell>{activity.product}</TableCell>
                      <TableCell>{activity.quantity}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            activity.status === "completed"
                              ? "default"
                              : activity.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Low Stock Alert</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Steel Rods quantity is below reorder level (Current: 12, Min: 50)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Pending Approval</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      3 delivery orders are waiting for your approval
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <PackageCheck className="h-5 w-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">New Receipt</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Receipt RCP-001 has been processed successfully
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
