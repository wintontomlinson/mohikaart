import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { lazy, Suspense } from "react";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import SiteLayout from "@/components/site/SiteLayout";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import CustomOrder from "./pages/CustomOrder";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

// Admin (lazy)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomOrders = lazy(() => import("./pages/admin/AdminCustomOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const Fallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#fdf9f0]">
    <div className="flex items-center gap-2 text-sm text-[#1a1208]/60">
      <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
      Loading...
    </div>
  </div>
);

const App = () => (
  <CartProvider>
    <WishlistProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1a1208",
            color: "#fdf9f0",
            border: "none",
            borderRadius: "9999px",
            padding: "12px 20px",
            fontSize: "14px",
          },
        }}
      />
      <BrowserRouter>
        <Suspense fallback={<Fallback />}>
          <Routes>
            {/* Storefront */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/custom-order" element={<CustomOrder />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="custom-orders" element={<AdminCustomOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </WishlistProvider>
  </CartProvider>
);

export default App;
