import { BrowserRouter, Route, Routes } from "react-router-dom";

import { DefaultProviders } from "./components/providers/default.tsx";
import Index from "./pages/Index.tsx";
import Cart from "./pages/Cart.tsx";
import History from "./pages/History.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
