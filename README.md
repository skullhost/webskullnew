# STORESKULLHOST - E-Commerce Website

Website toko online lengkap dengan sistem admin dan user yang dibangun menggunakan React, TypeScript, dan Convex.

## 🚀 Fitur Utama

### User Side (Pelanggan)
- **Beranda**: Menampilkan semua produk yang tersedia
- **Keranjang**: Mengelola produk yang akan dibeli
- **History**: Melihat riwayat pesanan dengan update status real-time
- **Beli Langsung**: Pembelian langsung dengan input WhatsApp dan nama
- **Responsive Design**: Tampilan optimal di desktop dan mobile

### Admin Side
- **Kelola Produk**: CRUD (Create, Read, Update, Delete) produk
- **Kelola Pesanan**: Melihat dan mengupdate status pesanan (Done/Cancel)
- **Real-time Updates**: Perubahan status langsung terlihat di user history
- **WhatsApp Integration**: Link langsung ke WhatsApp pelanggan

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Convex (Database & Backend Functions)
- **Authentication**: OIDC (OpenID Connect)
- **Routing**: React Router v7
- **State Management**: React hooks + Convex queries
- **UI Components**: shadcn/ui dengan design system yang konsisten

## 📦 Instalasi dan Setup

### Prerequisites
- Node.js 22+
- pnpm (package manager)
- Git

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd storeskullhost
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Convex Database**
   ```bash
   npx convex dev
   ```
   Ikuti instruksi untuk setup akun Convex dan konfigurasi database.

4. **Seed Sample Data (Opsional)**
   Buka Convex dashboard dan jalankan mutation `seed.seedProducts` untuk menambahkan data produk contoh.

5. **Jalankan Development Server**
   ```bash
   pnpm dev
   ```

6. **Akses Website**
   - Website: `http://localhost:5173`
   - Convex Dashboard: Link akan muncul di terminal

## 🔧 Konfigurasi Admin

Untuk mengakses admin panel:

1. **Buka website** dan login menggunakan akun Google/OIDC
2. **Kunjungi halaman admin** di `/admin`
3. **Klik "Become Admin"** untuk mendapatkan akses admin
4. **Klik "Add Sample Products"** untuk menambahkan produk contoh
5. **Mulai kelola** produk dan pesanan melalui admin panel

**Catatan**: User pertama yang klik "Become Admin" akan otomatis menjadi admin.

## 📱 Penggunaan

### Untuk Pelanggan
1. **Beranda**: Browse produk yang tersedia
2. **Add to Cart**: Klik tombol "Keranjang" untuk menambah ke keranjang
3. **Beli Langsung**: Klik "Beli Sekarang" untuk pembelian langsung
4. **Checkout**: Isi nama dan nomor WhatsApp, admin akan menghubungi
5. **History**: Cek status pesanan di menu "History"

### Untuk Admin
1. **Kelola Produk**: 
   - Tambah produk baru dengan foto, harga, deskripsi
   - Edit produk yang sudah ada
   - Hapus produk yang tidak diperlukan
   - Set status ketersediaan (In Stock/Out of Stock)

2. **Kelola Pesanan**:
   - Lihat semua pesanan yang masuk
   - Klik link WhatsApp untuk menghubungi pelanggan
   - Update status pesanan (Done/Cancel)
   - Perubahan status akan langsung muncul di history pelanggan

## 🎨 Customization

### Mengubah Tema
Website menggunakan tema "purple-matrix" dengan aksen ungu. Untuk mengubah tema, edit variabel CSS di `src/index.css`.

### Menambah Fitur Payment Gateway
Untuk integrasi dengan payment gateway (Midtrans, Xendit, dll), tambahkan di:
- `convex/orders.ts` untuk backend logic
- Komponen checkout di `src/pages/Cart.tsx` dan `src/pages/Index.tsx`

### Customisasi Tampilan
- Edit komponen di `src/components/`
- Modifikasi layout di `src/pages/`
- Sesuaikan styling dengan Tailwind CSS

## 📊 Database Schema

```typescript
// Products
{
  name: string,
  description: string,
  price: number,
  imageUrl?: string,
  category: string,
  inStock: boolean,
}

// Orders
{
  userId: string,
  username: string,
  whatsappNumber: string,
  products: Array<{
    productId: Id<"products">,
    name: string,
    price: number,
    quantity: number,
  }>,
  totalAmount: number,
  status: "pending" | "done" | "cancelled",
}

// Cart Items
{
  userId: string,
  productId: Id<"products">,
  quantity: number,
}
```

## 🚀 Deployment

### Deploy ke Vercel
1. Push code ke GitHub repository
2. Connect repository ke Vercel
3. Set environment variables dari Convex
4. Deploy otomatis setiap push ke main branch

### Environment Variables
Convex akan otomatis provide environment variables yang diperlukan. Tidak perlu setup manual untuk authentication.

## 📞 Support & Contact

Website ini dibuat untuk SKULLHOSTING dengan fitur lengkap e-commerce. 

### Fitur Unggulan:
- ✅ Real-time updates menggunakan Convex
- ✅ Mobile-responsive design
- ✅ WhatsApp integration untuk customer service
- ✅ Admin panel yang user-friendly
- ✅ Authentication system yang aman
- ✅ Modern UI/UX dengan shadcn/ui

---

**© 2025 SKULLHOSTING - STORESKULLHOST**

Built with ❤️ using React, TypeScript, Convex, and modern web technologies.
