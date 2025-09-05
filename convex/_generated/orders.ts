import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const createOrder = mutation({
  args: {
    username: v.string(),
    whatsappNumber: v.string(),
    products: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: "UNAUTHENTICATED",
      });
    }

    const orderId = await ctx.db.insert("orders", {
      userId: identity.tokenIdentifier,
      username: args.username,
      whatsappNumber: args.whatsappNumber,
      products: args.products,
      totalAmount: args.totalAmount,
      status: "pending",
    });

    // Clear cart after order creation
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    await Promise.all(
      cartItems.map((item) => ctx.db.delete(item._id))
    );

    return orderId;
  },
});

export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .order("desc")
      .collect();
  },
});

export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: "UNAUTHENTICATED",
      });
    }

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .first();

    if (!admin) {
      throw new ConvexError({
        message: "Access denied - please become admin first",
        code: "FORBIDDEN",
      });
    }

    return await ctx.db
      .query("orders")
      .order("desc")
      .collect();
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("done"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: "UNAUTHENTICATED",
      });
    }

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .first();

    if (!admin) {
      throw new ConvexError({
        message: "Access denied",
        code: "FORBIDDEN",
      });
    }

    return await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});

export const checkIsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .first();

    return !!admin;
  },
});

export const makeUserAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: "UNAUTHENTICATED",
      });
    }

    // Check if admin already exists for this user
    const existingAdmin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .first();

    if (existingAdmin) {
      return existingAdmin._id;
    }

    // Check if this is the first admin
    const existingAdmins = await ctx.db.query("admins").collect();
    if (existingAdmins.length === 0) {
      // First user can become admin
      return await ctx.db.insert("admins", {
        userId: identity.tokenIdentifier,
        email: args.email,
      });
    }

    // Otherwise, need to be invited by existing admin
    throw new ConvexError({
      message: "Admin access must be granted by existing admin",
      code: "FORBIDDEN",
    });
  },
});
