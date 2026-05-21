const customOrders = [
  { id: 1, name: "Anita Roy", phone: "+91 98765 43210", type: "Wedding Keepsake", budget: "₹3,000+", status: "New", date: "2024-01-15" },
  { id: 2, name: "Ravi Kumar", phone: "+91 87654 32109", type: "Name Keychain", budget: "Under ₹500", status: "Quoted", date: "2024-01-14" },
  { id: 3, name: "Pooja Mehta", phone: "+91 76543 21098", type: "Gift Hamper", budget: "₹1,500–₹3,000", status: "In Progress", date: "2024-01-13" },
  { id: 4, name: "Suresh Nair", phone: "+91 65432 10987", type: "Photo Frame", budget: "₹500–₹1,500", status: "Completed", date: "2024-01-12" },
  { id: 5, name: "Deepa Joshi", phone: "+91 54321 09876", type: "Resin Tray", budget: "₹1,500–₹3,000", status: "Reviewing", date: "2024-01-11" },
];

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Reviewing: "bg-yellow-100 text-yellow-700",
  Quoted: "bg-purple-100 text-purple-700",
  Confirmed: "bg-indigo-100 text-indigo-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
};

const AdminCustomOrders = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product Type</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Budget</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-3 font-medium text-[#1a1208]">{order.name}</td>
                <td className="px-6 py-3 text-gray-600">{order.phone}</td>
                <td className="px-6 py-3 text-gray-600">{order.type}</td>
                <td className="px-6 py-3 text-gray-600">{order.budget}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminCustomOrders;
