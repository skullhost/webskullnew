import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    inStock: v.boolean(),
  }).index("by_category", ["category"]),

  orders: defineTable({
    userId: v.string(),
    username: v.string(),
    whatsappNumber: v.string(),
    products: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    totalAmount: v.number(),
    status: v.union(v.literal("pending"), v.literal("done"), v.literal("cancelled")),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"]),

  cartItems: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_product", ["userId", "productId"]),

  admins: defineTable({
    userId: v.string(),
    email: v.string(),
  }).index("by_user", ["userId"]),
});
