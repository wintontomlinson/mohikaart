import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/site/Navbar";
import AnnouncementBar from "@/components/site/AnnouncementBar";
import Footer from "@/components/site/Footer";
import WhatsAppFab from "@/components/site/WhatsAppFab";
import BackToTop from "@/components/site/BackToTop";
import CartDrawer from "@/components/site/CartDrawer";
import LoadingScreen from "@/components/site/LoadingScreen";
import CursorSpotlight from "@/components/site/CursorSpotlight";
import ScrollProgress from "@/components/site/ScrollProgress";
import PageTransition from "@/components/site/PageTransition";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { useEffect } from "react";

const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);
  return null;
};

const SiteLayout = () => {
  const location = useLocation();
  return (
    <CartProvider>
      <WishlistProvider>
        <LoadingScreen />
        <CursorSpotlight />
        <ScrollProgress />
        <ScrollTop />
        <AnnouncementBar />
        <Navbar />
        <main className="relative" style={{ paddingTop: "100px" }}>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
        <WhatsAppFab />
        <BackToTop />
        <CartDrawer />
      </WishlistProvider>
    </CartProvider>
  );
};

export default SiteLayout;
