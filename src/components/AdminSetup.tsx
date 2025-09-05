import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Shield, Package } from "lucide-react";
import { toast } from "sonner";

export function AdminSetup() {
  const makeCurrentUserAdmin = useMutation(api.seed.makeCurrentUserAdmin);
  const seedProducts = useMutation(api.seed.seedProducts);

  const handleMakeAdmin = async () => {
    try {
      const result = await makeCurrentUserAdmin({});
      toast.success(result);
      // Reload page after becoming admin
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error("Failed to become admin");
    }
  };

  const handleSeedProducts = async () => {
    try {
      const result = await seedProducts({});
      toast.success(result);
    } catch (error) {
      toast.error("Failed to seed products");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            First time here? Click below to become an admin and manage products and orders.
          </p>
          <Button onClick={handleMakeAdmin} className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            Become Admin
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Add sample products to get started with your store.
          </p>
          <Button onClick={handleSeedProducts} variant="outline" className="w-full">
            <Package className="h-4 w-4 mr-2" />
            Add Sample Products
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
