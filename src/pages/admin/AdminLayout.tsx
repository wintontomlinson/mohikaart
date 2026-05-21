import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  LayoutDashboard, ShoppingBag, Package, Palette, Users, Star,
  Image, Settings, LogOut, Bell,
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ShoppingBag, label: "Products", href: "/admin/products" },
  { icon: Package, label: "Orders", href: "/admin/orders" },
  { icon: Palette, label: "Custom Orders", href: "/admin/custom-orders" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
  { icon: Image, label: "Gallery", href: "/admin/gallery" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("mohika.admin");
    if (!isAdmin) navigate("/admin/login");
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("mohika.admin");
    navigate("/admin/login");
  };

  const currentPage = sidebarLinks.find(
    (l) => l.href === location.pathname || (l.href !== "/admin" && location.pathname.startsWith(l.href))
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1a1208] text-[#fdf9f0] flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#1a1208] font-serif text-sm font-bold">
              M
            </div>
            <span className="font-serif text-sm">Mohika <span className="italic text-[#c9a84c]">Art</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map(({ icon: Icon, label, href }) => {
            const active = location.pathname === href || (href !== "/admin" && location.pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? "bg-[#c9a84c]/10 text-[#c9a84c]" : "text-[#fdf9f0]/60 hover:text-[#fdf9f0] hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#fdf9f0]/50 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-medium text-[#1a1208]">{currentPage?.label || "Admin"}</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#1a1208] text-xs font-bold">
              A
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
