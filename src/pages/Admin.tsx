import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { 
  Settings, 
  Package, 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Phone,
  User,
  Check,
  X,
  Clock
} from "lucide-react";
import { Navbar } from "@/components/Navbar.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { EmptyStateCard } from "@/components/EmptyStateCard.tsx";
import { AdminSetup } from "@/components/AdminSetup.tsx";
import { useAuth, useUser } from "@/hooks/use-auth.ts";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
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

export default function Admin() {
  const { isAuthenticated } = useAuth();
  const { email } = useUser();
  const isAdmin = useQuery(api.orders.checkIsAdmin);
  const products = useQuery(api.products.getAllProducts);
  const orders = useQuery(api.orders.getAllOrders);
  
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
  const makeUserAdmin = useMutation(api.orders.makeUserAdmin);

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    inStock: true,
  });

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "",
      inStock: true,
    });
    setEditingProduct(null);
  };

  const handleOpenProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl || "",
        category: product.category,
        inStock: product.inStock,
      });
    } else {
      resetProductForm();
    }
    setProductDialogOpen(true);
  };

  const handleProductSubmit = async () => {
    if (!productForm.name.trim() || !productForm.description.trim() || !productForm.price.trim() || !productForm.category.trim()) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    const price = parseFloat(productForm.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Harga harus berupa angka yang valid");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct({
          productId: editingProduct._id,
          name: productForm.name,
          description: productForm.description,
          price,
          imageUrl: productForm.imageUrl || undefined,
          category: productForm.category,
          inStock: productForm.inStock,
        });
        toast.success("Produk berhasil diupdate");
      } else {
        await createProduct({
          name: productForm.name,
          description: productForm.description,
          price,
          imageUrl: productForm.imageUrl || undefined,
          category: productForm.category,
          inStock: productForm.inStock,
        });
        toast.success("Produk berhasil ditambahkan");
      }
      setProductDialogOpen(false);
      resetProductForm();
    } catch (error) {
      toast.error("Gagal menyimpan produk");
    }
  };

  const handleDeleteProduct = async (productId: Id<"products">) => {
    try {
      await deleteProduct({ productId });
      toast.success("Produk berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus produk");
    }
  };

  const handleUpdateOrderStatus = async (orderId: Id<"orders">, status: "pending" | "done" | "cancelled") => {
    try {
      await updateOrderStatus({ orderId, status });
      toast.success("Status pesanan berhasil diupdate");
    } catch (error) {
      toast.error("Gagal mengupdate status pesanan");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "done":
        return <Badge variant="default" className="bg-green-100 text-green-800">Selesai</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <EmptyStateCard
            icon={Settings}
            title="Silakan Login"
            description="Anda perlu login terlebih dahulu untuk mengakses admin panel."
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (isAdmin === undefined) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking admin access...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                Admin Panel
              </h1>
              <p className="text-muted-foreground mt-2">
                Setup admin access to manage products and orders
              </p>
            </div>
            <AdminSetup />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-2">
              Kelola produk dan pesanan di toko online
            </p>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Kelola Produk</TabsTrigger>
              <TabsTrigger value="orders">Kelola Pesanan</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Daftar Produk</h2>
                <Button onClick={() => handleOpenProductDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produk
                </Button>
              </div>

              {products === undefined ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="h-48 w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <EmptyStateCard
                  icon={Package}
                  title="Belum ada produk"
                  description="Mulai dengan menambahkan produk pertama Anda."
                  action={
                    <Button onClick={() => handleOpenProductDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Produk
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product._id} className="overflow-hidden">
                      <div className="relative">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-muted flex items-center justify-center">
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
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenProductDialog(product)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-2xl font-semibold">Daftar Pesanan</h2>

              {orders === undefined ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <EmptyStateCard
                  icon={ShoppingBag}
                  title="Belum ada pesanan"
                  description="Pesanan akan muncul di sini ketika pelanggan melakukan pemesanan."
                />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order._id} className="overflow-hidden">
                      <CardHeader className="bg-muted/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              Pesanan #{order._id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Clock className="h-4 w-4" />
                              {format(new Date(order._creationTime), "dd MMM yyyy, HH:mm", { locale: id })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-6">
                        {/* Customer Info */}
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Informasi Pelanggan
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2 text-sm">
                            <p><span className="font-medium">Nama:</span> {order.username}</p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span className="font-medium">WhatsApp:</span> 
                              <a 
                                href={`https://wa.me/${order.whatsappNumber}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {order.whatsappNumber}
                              </a>
                            </p>
                          </div>
                        </div>

                        {/* Products */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Produk yang Dipesan:</h4>
                          <div className="space-y-2">
                            {order.products.map((product, index) => (
                              <div key={index} className="flex justify-between items-center p-2 border rounded">
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                                </div>
                                <p className="font-medium">
                                  Rp {(product.price * product.quantity).toLocaleString('id-ID')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total */}
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total Pembayaran:</span>
                            <span className="text-lg font-bold text-primary">
                              Rp {order.totalAmount.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        {order.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order._id, "done")}
                              className="flex-1"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Tandai Selesai
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order._id, "cancelled")}
                              className="flex-1"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Batalkan
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama Produk *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Masukkan nama produk"
                />
              </div>
              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Input
                  id="category"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  placeholder="Contoh: Elektronik, Fashion, dll"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Masukkan deskripsi produk"
                rows={3}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Harga *</Label>
                <Input
                  id="price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={productForm.inStock}
                  onCheckedChange={(checked) => setProductForm({ ...productForm, inStock: checked })}
                />
                <Label htmlFor="inStock">Produk tersedia</Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="imageUrl">URL Gambar (opsional)</Label>
              <Input
                id="imageUrl"
                value={productForm.imageUrl}
                onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setProductDialogOpen(false)} 
                className="flex-1"
              >
                Batal
              </Button>
              <Button onClick={handleProductSubmit} className="flex-1">
                {editingProduct ? "Update" : "Tambah"} Produk
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
