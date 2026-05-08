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
import { useEffect } from "react";

const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);
  return null;
};

const SiteLayout = () => (
  <CartProvider>
    <LoadingScreen />
    <CursorSpotlight />
    <ScrollProgress />
    <ScrollTop />
    <Navbar />
    <main className="relative pt-[98px] md:pt-[106px]">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppFab />
    <BackToTop />
    <CartDrawer />
  </CartProvider>
);

export default SiteLayout;
