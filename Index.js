import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package2, BarChart3, Package, Truck, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">StockMaster</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Login
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Streamline Your Inventory Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Replace manual registers and Excel sheets with a centralized, real-time inventory system.
            Track stock, manage operations, and optimize your warehouse efficiency.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              <Package2 className="h-5 w-5" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Real-Time Dashboard</h3>
              <p className="text-muted-foreground">
                Monitor inventory levels, pending operations, and alerts in one centralized view.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Product Management</h3>
              <p className="text-muted-foreground">
                Track products with SKUs, categories, and real-time stock availability across locations.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Operations Tracking</h3>
              <p className="text-muted-foreground">
                Manage receipts, deliveries, transfers, and adjustments with complete audit trails.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Smart Alerts</h3>
              <p className="text-muted-foreground">
                Get notified about low stock, pending approvals, and critical inventory issues.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 py-16 mt-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join hundreds of businesses that have digitized their stock operations with StockMaster.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started Today
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/50 py-8 mt-20">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2025 StockMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
