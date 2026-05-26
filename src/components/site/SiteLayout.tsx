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
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Tiny delay so browser paints first frame, then trigger CSS transitions
    requestAnimationFrame(() => {
      setTimeout(() => setRevealed(true), 50);
    });
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <LoadingScreen />
        <div className={`site-reveal ${revealed ? "site-revealed" : ""}`}>
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
