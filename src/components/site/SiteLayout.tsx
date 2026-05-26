import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppFab from "@/components/site/WhatsAppFab";
import BackToTop from "@/components/site/BackToTop";
import CartDrawer from "@/components/site/CartDrawer";
import LoadingScreen from "@/components/site/LoadingScreen";
import CursorSpotlight from "@/components/site/CursorSpotlight";
import ScrollProgress from "@/components/site/ScrollProgress";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { useEffect, useState } from "react";

const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);
  return null;
};

const SiteLayout = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for splash to finish (3.3s) then reveal site with smooth fade
    const timer = setTimeout(() => setReady(true), 3400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <LoadingScreen />
        <div
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "none" : "translateY(10px)",
            transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <CursorSpotlight />
          <ScrollProgress />
          <ScrollTop />
          <Navbar />
          <main className="relative">
            <Outlet />
          </main>
          <Footer />
          <WhatsAppFab />
          <BackToTop />
          <CartDrawer />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
};

export default SiteLayout;
