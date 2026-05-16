import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import SiteLayout from "@/components/site/SiteLayout";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import Checkout from "./pages/Checkout";
import WeddingPage from "./pages/WeddingPage";
import CorporatePage from "./pages/CorporatePage";
import CareGuidePage from "./pages/CareGuidePage";
import FAQPage from "./pages/FAQPage";
import ShippingPage from "./pages/ShippingPage";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminImages from "./pages/admin/AdminImages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminHero from "./pages/admin/AdminHero";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminCoupons from "./pages/admin/AdminCoupons";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            <Route path="/checkout" element={<Checkout />} />
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
            <Route path="images" element={<AdminImages />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
