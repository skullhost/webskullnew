import { Store } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              STORESKULLHOST
            </span>
          </div>

          {/* Copyright */}
          <div className="text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SKULLHOSTING. All rights reserved.</p>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>Your trusted online store</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with ❤️ using modern web technologies</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
