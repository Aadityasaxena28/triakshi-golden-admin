import { Package, Receipt, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import gemsHero from "@/assets/gems-hero.jpg";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "248",
      icon: Package,
      trend: "+12%",
      color: "text-primary",
    },
    {
      title: "Total Orders",
      value: "1,429",
      icon: Receipt,
      trend: "+8%",
      color: "text-accent",
    },
    {
      title: "Revenue",
      value: "₹12.5L",
      icon: DollarSign,
      trend: "+23%",
      color: "text-secondary",
    },
    {
      title: "Growth",
      value: "18.2%",
      icon: TrendingUp,
      trend: "+5%",
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-xl overflow-hidden shadow-elevated">
        <img
          src={gemsHero}
          alt="Triakshi Gems"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60 flex items-center px-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Jai Maa Pitambara
            </h1>
            <p className="text-white/90 text-lg">
              Manage your sacred gemstones and yantras with ease
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-green-600 font-medium">{stat.trend}</span> from
                last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/products/add"
            className="p-6 rounded-lg border border-border hover:border-primary hover:shadow-soft transition-all bg-gradient-to-br from-primary/5 to-transparent"
          >
            <Package className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Add New Product</h3>
            <p className="text-sm text-muted-foreground">
              Add gemstones, yantras, or other items
            </p>
          </a>
          <a
            href="/products"
            className="p-6 rounded-lg border border-border hover:border-accent hover:shadow-soft transition-all bg-gradient-to-br from-accent/5 to-transparent"
          >
            <Package className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold mb-1">Manage Products</h3>
            <p className="text-sm text-muted-foreground">
              View, edit, or delete products
            </p>
          </a>
          <a
            href="/bills"
            className="p-6 rounded-lg border border-border hover:border-secondary hover:shadow-soft transition-all bg-gradient-to-br from-secondary/5 to-transparent"
          >
            <Receipt className="h-8 w-8 text-secondary mb-3" />
            <h3 className="font-semibold mb-1">View Orders</h3>
            <p className="text-sm text-muted-foreground">
              Check customer bills and orders
            </p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
