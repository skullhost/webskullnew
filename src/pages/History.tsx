import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { History as HistoryIcon, Package, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { EmptyStateCard } from "@/components/EmptyStateCard.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function History() {
  const { isAuthenticated } = useAuth();
  const orders = useQuery(api.orders.getUserOrders);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pesanan sedang diproses. Admin akan menghubungi Anda segera.";
      case "done":
        return "Pesanan telah selesai diproses.";
      case "cancelled":
        return "Pesanan dibatalkan.";
      default:
        return "Status tidak diketahui.";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <EmptyStateCard
            icon={HistoryIcon}
            title="Silakan Login"
            description="Anda perlu login terlebih dahulu untuk melihat riwayat pesanan."
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
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <HistoryIcon className="h-8 w-8 text-primary" />
              Riwayat Pesanan
            </h1>
            <p className="text-muted-foreground mt-2">
              Lihat semua pesanan yang pernah Anda buat
            </p>
          </div>

          {orders === undefined ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyStateCard
              icon={HistoryIcon}
              title="Belum Ada Pesanan"
              description="Anda belum pernah membuat pesanan. Mulai berbelanja sekarang!"
              action={
                <a 
                  href="/" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Mulai Berbelanja
                </a>
              }
            />
          ) : (
            <div className="space-y-6">
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
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    {/* Customer Info */}
                    <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2">Informasi Kontak:</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium">Nama:</span> {order.username}</p>
                        <p><span className="font-medium">WhatsApp:</span> {order.whatsappNumber}</p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Produk yang Dipesan:</h4>
                      {order.products.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Kuantitas: {product.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              Rp {(product.price * product.quantity).toLocaleString('id-ID')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              @Rp {product.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total Pembayaran:</span>
                        <span className="text-xl font-bold text-primary">
                          Rp {order.totalAmount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Status Description */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        {getStatusText(order.status)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
