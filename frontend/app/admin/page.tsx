import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceMobile, Users, Car, CurrencyDollar } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Productos", value: "124", icon: DeviceMobile, color: "text-blue-500" },
  { title: "Usuarios", value: "56", icon: Users, color: "text-green-500" },
  { title: "Pedidos", value: "89", icon: Car, color: "text-orange-500" },
  { title: "Ingresos", value: "$12,450", icon: CurrencyDollar, color: "text-purple-500" },
];

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn(stat.color, "size-5")} weight="bold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}