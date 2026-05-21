import { useState } from "react";

const orders = [
  { id: "MKA4521", date: "2024-01-15", customer: "Priya Sharma", items: "Name Keychain x1", amount: 499, status: "Delivered" },
  { id: "MKA4520", date: "2024-01-14", customer: "Rahul Gupta", items: "Photo Frame x1", amount: 1299, status: "Shipped" },
  { id: "MKA4519", date: "2024-01-14", customer: "Sneha Patel", items: "Wedding Keepsake x1", amount: 2499, status: "Processing" },
  { id: "MKA4518", date: "2024-01-13", customer: "Vikram Singh", items: "Resin Tray x2", amount: 2398, status: "Pending" },
  { id: "MKA4517", date: "2024-01-13", customer: "Meera Kapoor", items: "Bookmark Set x1", amount: 699, status: "Delivered" },
  { id: "MKA4516", date: "2024-01-12", customer: "Ananya Desai", items: "Gift Hamper x1", amount: 2999, status: "Shipped" },
  { id: "MKA4515", date: "2024-01-12", customer: "Karan Mehta", items: "Coaster Set x1", amount: 899, status: "Cancelled" },
];

const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? orders : orders.filter((o) => o.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${
              activeTab === tab
                ? "bg-[#1a1208] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#c9a84c]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-3 font-medium text-[#1a1208]">{order.id}</td>
                  <td className="px-6 py-3 text-gray-500">{order.date}</td>
                  <td className="px-6 py-3 text-gray-600">{order.customer}</td>
                  <td className="px-6 py-3 text-gray-600">{order.items}</td>
                  <td className="px-6 py-3 font-medium">₹{order.amount.toLocaleString("en-IN")}</td>
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
    </div>
  );
};

export default AdminOrders;
