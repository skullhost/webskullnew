import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ShoppingCart, Package } from "lucide-react";
import { Navbar } from "@/components/Navbar.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { EmptyStateCard } from "@/components/EmptyStateCard.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

type Product = {
  _id: Id<"products">;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  inStock: boolean;
  _creationTime: number;
};

export default function Index() {
  const { isAuthenticated } = useAuth();
  const products = useQuery(api.products.getAllProducts);
  const addToCart = useMutation(api.cart.addToCart);
  const createOrder = useMutation(api.orders.createOrder);

  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderForm, setOrderForm] = useState({
    username: "",
    whatsappNumber: "",
  });

  const handleAddToCart = async (productId: Id<"products">) => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    try {
      await addToCart({ productId, quantity: 1 });
      toast.success("Produk berhasil ditambahkan ke keranjang");
    } catch (error) {
      toast.error("Gagal menambahkan produk ke keranjang");
    }
  };

  const handleBuyNow = (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }
    setSelectedProduct(product);
    setBuyDialogOpen(true);
  };

  const handleOrderSubmit = async () => {
    if (!orderForm.username.trim() || !orderForm.whatsappNumber.trim()) {
      toast.error("Mohon lengkapi semua data");
      return;
    }

    if (!selectedProduct) return;

    try {
      await createOrder({
        username: orderForm.username,
        whatsappNumber: orderForm.whatsappNumber,
        products: [{
          productId: selectedProduct._id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
        }],
        totalAmount: selectedProduct.price,
      });

      toast.success("Pesanan berhasil dibuat! Admin akan menghubungi Anda segera.");
      setBuyDialogOpen(false);
      setOrderForm({ username: "", whatsappNumber: "" });
      setSelectedProduct(null);
    } catch (error) {
      toast.error("Gagal membuat pesanan");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-purple-50 to-background py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                STORESKULLHOST
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Temukan produk berkualitas terbaik dengan harga terjangkau. 
              Berbelanja mudah, aman, dan terpercaya.
            </p>
            <Button size="lg" className="rounded-full">
              Mulai Berbelanja
            </Button>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Produk Kami</h2>
              <p className="text-lg text-muted-foreground">
                Pilihan produk terbaik untuk kebutuhan Anda
              </p>
            </div>

            {products === undefined ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-9 w-24" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyStateCard
                icon={Package}
                title="Belum ada produk"
                description="Produk akan segera ditambahkan. Silakan kembali lagi nanti."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant={product.inStock ? "default" : "destructive"}>
                          {product.inStock ? "Tersedia" : "Habis"}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={!product.inStock || !isAuthenticated}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Keranjang
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBuyNow(product)}
                        disabled={!product.inStock || !isAuthenticated}
                        className="flex-1"
                      >
                        Beli Sekarang
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Buy Now Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Beli Produk: {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Nama Lengkap</Label>
              <Input
                id="username"
                value={orderForm.username}
                onChange={(e) => setOrderForm({ ...orderForm, username: e.target.value })}
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
              <Input
                id="whatsapp"
                value={orderForm.whatsappNumber}
                onChange={(e) => setOrderForm({ ...orderForm, whatsappNumber: e.target.value })}
                placeholder="Contoh: 081234567890"
              />
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Detail Pesanan:</h4>
              <p className="text-sm text-muted-foreground mb-1">
                Produk: {selectedProduct?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Harga: Rp {selectedProduct?.price.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-muted-foreground">
                Kuantitas: 1
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setBuyDialogOpen(false)} className="flex-1">
                Batal
              </Button>
              <Button onClick={handleOrderSubmit} className="flex-1">
                Selesai
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
