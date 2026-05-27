import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

import SiteLayout from "@/components/site/SiteLayout";
import SeoUpdater from "@/components/site/SeoUpdater";

// ── Storefront ── always-needed pages stay eager
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import CustomOrderPage from "./pages/CustomOrderPage";
import Checkout from "./pages/Checkout";
import WishlistPage from "./pages/WishlistPage";
import NotFound from "./pages/NotFound";

// Rarely-visited storefront pages → lazy
const WeddingPage    = lazy(() => import("./pages/WeddingPage"));
const CorporatePage  = lazy(() => import("./pages/CorporatePage"));
const CareGuidePage  = lazy(() => import("./pages/CareGuidePage"));
const FAQPage        = lazy(() => import("./pages/FAQPage"));
const ShippingPage   = lazy(() => import("./pages/ShippingPage"));

// Admin — eager import so it loads without network dependency on lazy chunks
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminCMS from "./pages/admin/AdminCMS";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

const RouteFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center text-sm text-muted-foreground bg-background z-50">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      Loading…
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <SeoUpdater />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Site */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/custom-order" element={<CustomOrderPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/wedding" element={<WeddingPage />} />
              <Route path="/corporate" element={<CorporatePage />} />
              <Route path="/care-guide" element={<CareGuidePage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="cms" element={<AdminCMS />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
