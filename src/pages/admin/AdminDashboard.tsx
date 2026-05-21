import { Package, DollarSign, Palette, Star } from "lucide-react";

const stats = [
  { icon: Package, label: "Total Orders", value: "2,847", change: "+12%", color: "bg-blue-50 text-blue-600" },
  { icon: DollarSign, label: "Revenue", value: "₹18,42,500", change: "+8%", color: "bg-green-50 text-green-600" },
  { icon: Palette, label: "Custom Orders", value: "156", change: "+23%", color: "bg-purple-50 text-purple-600" },
  { icon: Star, label: "Avg Rating", value: "4.9", change: "+0.1", color: "bg-yellow-50 text-yellow-600" },
];

const recentOrders = [
  { id: "MKA4521", customer: "Priya Sharma", product: "Name Keychain", amount: "₹499", status: "Delivered" },
  { id: "MKA4520", customer: "Rahul Gupta", product: "Photo Frame", amount: "₹1,299", status: "Shipped" },
  { id: "MKA4519", customer: "Sneha Patel", product: "Wedding Keepsake", amount: "₹2,499", status: "Processing" },
  { id: "MKA4518", customer: "Vikram Singh", product: "Resin Tray", amount: "₹1,199", status: "Pending" },
  { id: "MKA4517", customer: "Meera Kapoor", product: "Bookmark Set", amount: "₹699", status: "Delivered" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminDashboard = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, change, color }) => (
        <div key={label} className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{change}</span>
          </div>
          <p className="text-2xl font-semibold text-[#1a1208]">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
      ))}
    </div>

    {/* Recent Orders */}
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h2 className="font-medium text-[#1a1208]">Recent Orders</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-[#1a1208]">{order.id}</td>
                <td className="px-6 py-3 text-gray-600">{order.customer}</td>
                <td className="px-6 py-3 text-gray-600">{order.product}</td>
                <td className="px-6 py-3 font-medium">{order.amount}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Top Products */}
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="font-medium text-[#1a1208] mb-4">Top Products</h2>
      <div className="space-y-3">
        {[
          { name: "Personalized Name Keychain", sales: 128, pct: 90 },
          { name: "Floral Heart Resin Tray", sales: 103, pct: 80 },
          { name: "Couple Photo Frame", sales: 94, pct: 73 },
          { name: "Ocean Resin Coaster Set", sales: 82, pct: 64 },
          { name: "Wedding Memory Frame", sales: 71, pct: 55 },
        ].map((p) => (
          <div key={p.name} className="flex items-center gap-4">
            <span className="text-sm text-gray-700 w-48 truncate">{p.name}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#c9a84c] rounded-full" style={{ width: `${p.pct}%` }} />
            </div>
            <span className="text-xs text-gray-500 w-16 text-right">{p.sales} sold</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
