import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const getCartItems = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return itemsWithProducts.filter(item => item.product !== null);
  },
});

export const addToCart = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: "UNAUTHENTICATED",
      });
    }

    // Check if item already exists in cart
    const existingItem = await ctx.db
      .query("cartItems")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", identity.tokenIdentifier).eq("productId", args.productId)
      )
      .first();

    if (existingItem) {
      // Update quantity
      return await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
      });
    } else {
      // Add new item
      return await ctx.db.insert("cartItems", {
        userId: identity.tokenIdentifier,
        productId: args.productId,
        quantity: args.quantity,
      });
    }
  },
});

export const updateCartItemQuantity = mutation({
  args: {
    cartItemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: "UNAUTHENTICATED",
      });
    }

    if (args.quantity <= 0) {
      return await ctx.db.delete(args.cartItemId);
    }

    return await ctx.db.patch(args.cartItemId, {
      quantity: args.quantity,
    });
  },
});

export const removeFromCart = mutation({
  args: { cartItemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: "UNAUTHENTICATED",
      });
    }

    return await ctx.db.delete(args.cartItemId);
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: "UNAUTHENTICATED",
      });
    }

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    await Promise.all(
      cartItems.map((item) => ctx.db.delete(item._id))
    );
  },
});
