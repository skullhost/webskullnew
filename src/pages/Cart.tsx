import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Minus, Plus, Trash2, ShoppingBag, Package } from "lucide-react";
import { Navbar } from "@/components/Navbar.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { EmptyStateCard } from "@/components/EmptyStateCard.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

type CartItem = {
  _id: Id<"cartItems">;
  userId: string;
  productId: Id<"products">;
  quantity: number;
  _creationTime: number;
  product: {
    _id: Id<"products">;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category: string;
    inStock: boolean;
    _creationTime: number;
  } | null;
};

export default function Cart() {
  const { isAuthenticated, user } = useAuth();
  const cartItems = useQuery(api.cart.getCartItems) as CartItem[] | undefined;
  const updateCartItemQuantity = useMutation(api.cart.updateCartItemQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const createOrder = useMutation(api.orders.createOrder);

  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    username: "",
    whatsappNumber: "",
  });

  const totalAmount = cartItems?.reduce((sum, item) => 
    sum + (item.product?.price || 0) * item.quantity, 0
  ) || 0;

  const handleUpdateQuantity = async (cartItemId: Id<"cartItems">, newQuantity: number) => {
    try {
      await updateCartItemQuantity({ cartItemId, quantity: newQuantity });
    } catch (error) {
      toast.error("Gagal mengubah kuantitas");
    }
  };

  const handleRemoveItem = async (cartItemId: Id<"cartItems">) => {
    try {
      await removeFromCart({ cartItemId });
      toast.success("Produk berhasil dihapus dari keranjang");
    } catch (error) {
      toast.error("Gagal menghapus produk");
    }
  };

  const handleCheckout = async () => {
    if (!orderForm.username.trim() || !orderForm.whatsappNumber.trim()) {
      toast.error("Mohon lengkapi semua data");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    try {
      const orderProducts = cartItems.map(item => ({
        productId: item.productId,
        name: item.product?.name || "Unknown",
        price: item.product?.price || 0,
        quantity: item.quantity,
      }));

      await createOrder({
        username: orderForm.username,
        whatsappNumber: orderForm.whatsappNumber,
        products: orderProducts,
        totalAmount,
      });

      toast.success("Pesanan berhasil dibuat! Admin akan menghubungi Anda segera.");
      setCheckoutDialogOpen(false);
      setOrderForm({ username: "", whatsappNumber: "" });
    } catch (error) {
      toast.error("Gagal membuat pesanan");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <EmptyStateCard
            icon={ShoppingBag}
            title="Silakan Login"
            description="Anda perlu login terlebih dahulu untuk melihat keranjang belanja."
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Keranjang Belanja</h1>
            <p className="text-muted-foreground mt-2">
              Kelola produk yang ingin Anda beli
            </p>
          </div>

          {cartItems === undefined ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-20 w-20 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <EmptyStateCard
              icon={ShoppingBag}
              title="Keranjang Kosong"
              description="Belum ada produk di keranjang Anda. Mulai berbelanja sekarang!"
              action={
                <Button asChild>
                  <a href="/">Mulai Berbelanja</a>
                </Button>
              }
            />
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-20 w-20 object-cover rounded"
                            />
                          ) : (
                            <div className="h-20 w-20 bg-muted flex items-center justify-center rounded">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate">
                            {item.product?.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {item.product?.category}
                          </p>
                          <p className="text-xl font-bold text-primary">
                            Rp {item.product?.price.toLocaleString('id-ID')}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            Rp {((item.product?.price || 0) * item.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Checkout Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Total Item:</span>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Harga:</span>
                    <span className="text-primary">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setCheckoutDialogOpen(true)}
                  >
                    Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout Pesanan</DialogTitle>
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
              <div className="space-y-1 text-sm text-muted-foreground">
                {cartItems?.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span>{item.product?.name} (x{item.quantity})</span>
                    <span>Rp {((item.product?.price || 0) * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold text-foreground">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCheckoutDialogOpen(false)} className="flex-1">
                Batal
              </Button>
              <Button onClick={handleCheckout} className="flex-1">
                Buat Pesanan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
