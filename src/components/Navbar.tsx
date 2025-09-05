import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, History, Settings, Store } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const cartItems = useQuery(api.cart.getCartItems);
  const isAdmin = useQuery(api.orders.checkIsAdmin);

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <Store className="h-6 w-6" />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              STORESKULLHOST
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Button 
              variant={isActive("/") ? "default" : "ghost"} 
              size="sm" 
              asChild
            >
              <Link to="/" className="flex items-center space-x-2">
                <Store className="h-4 w-4" />
                <span>Beranda</span>
              </Link>
            </Button>

            {isAuthenticated && (
              <>
                <Button 
                  variant={isActive("/cart") ? "default" : "ghost"} 
                  size="sm" 
                  asChild
                  className="relative"
                >
                  <Link to="/cart" className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Keranjang</span>
                    {cartItemCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <Button 
                  variant={isActive("/history") ? "default" : "ghost"} 
                  size="sm" 
                  asChild
                >
                  <Link to="/history" className="flex items-center space-x-2">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </Link>
                </Button>

                {isAdmin && (
                  <Button 
                    variant={isActive("/admin") ? "default" : "ghost"} 
                    size="sm" 
                    asChild
                  >
                    <Link to="/admin" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <SignInButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={isActive("/") ? "default" : "outline"} 
              size="sm" 
              asChild
            >
              <Link to="/" className="flex items-center space-x-2">
                <Store className="h-4 w-4" />
                <span>Beranda</span>
              </Link>
            </Button>

            {isAuthenticated && (
              <>
                <Button 
                  variant={isActive("/cart") ? "default" : "outline"} 
                  size="sm" 
                  asChild
                  className="relative"
                >
                  <Link to="/cart" className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Keranjang</span>
                    {cartItemCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <Button 
                  variant={isActive("/history") ? "default" : "outline"} 
                  size="sm" 
                  asChild
                >
                  <Link to="/history" className="flex items-center space-x-2">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </Link>
                </Button>

                {isAdmin && (
                  <Button 
                    variant={isActive("/admin") ? "default" : "outline"} 
                    size="sm" 
                    asChild
                  >
                    <Link to="/admin" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
