import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if products already exist
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length > 0) {
      return "Products already exist";
    }

    const sampleProducts = [
      {
        name: "Laptop Gaming ROG Strix",
        description: "Laptop gaming high-performance dengan processor Intel Core i7, RAM 16GB, SSD 512GB, dan graphics card RTX 4060. Perfect untuk gaming dan produktivitas.",
        price: 15000000,
        category: "Elektronik",
        inStock: true,
      },
      {
        name: "Smartphone Samsung Galaxy S24",
        description: "Smartphone flagship terbaru dengan kamera 200MP, layar AMOLED 6.8 inch, RAM 12GB, dan storage 256GB. Dilengkapi dengan fitur AI terdepan.",
        price: 12000000,
        category: "Elektronik",
        inStock: true,
      },
      {
        name: "Headset Gaming HyperX Cloud",
        description: "Headset gaming profesional dengan audio 7.1 surround sound, mikrofon noise-cancelling, dan desain yang nyaman untuk gaming marathon.",
        price: 1500000,
        category: "Gaming",
        inStock: true,
      },
      {
        name: "Mechanical Keyboard RGB",
        description: "Keyboard mechanical dengan switch Cherry MX Blue, RGB lighting customizable, dan build quality premium. Ideal untuk gaming dan typing.",
        price: 800000,
        category: "Gaming",
        inStock: true,
      },
      {
        name: "Hoodie Premium Cotton",
        description: "Hoodie premium berbahan cotton combed 30s, sablon rubber berkualitas tinggi, dan cutting slim fit. Tersedia berbagai warna menarik.",
        price: 250000,
        category: "Fashion",
        inStock: true,
      },
      {
        name: "Sneakers Running Nike",
        description: "Sepatu running Nike dengan teknologi Air Zoom, upper mesh breathable, dan outsole rubber anti-slip. Cocok untuk olahraga dan casual.",
        price: 1200000,
        category: "Fashion",
        inStock: false,
      },
      {
        name: "Powerbank 20000mAh",
        description: "Powerbank capacity 20000mAh dengan fast charging PD 22.5W, wireless charging, dan LED indicator. Kompatibel dengan semua device.",
        price: 300000,
        category: "Elektronik",
        inStock: true,
      },
      {
        name: "Smart Watch Apple Series 9",
        description: "Apple Watch Series 9 dengan chipset S9, Always-On Retina display, GPS + Cellular, dan battery life hingga 18 jam.",
        price: 6000000,
        category: "Elektronik",
        inStock: true,
      }
    ];

    const insertPromises = sampleProducts.map(product => 
      ctx.db.insert("products", product)
    );

    await Promise.all(insertPromises);
    
    return `Successfully seeded ${sampleProducts.length} products`;
  },
});

export const makeCurrentUserAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be logged in");
    }

    // Check if already admin
    const existingAdmin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .first();

    if (existingAdmin) {
      return "Already an admin";
    }

    // Create admin entry
    await ctx.db.insert("admins", {
      userId: identity.tokenIdentifier,
      email: identity.email || "unknown@example.com",
    });

    return "Successfully made admin";
  },
});
