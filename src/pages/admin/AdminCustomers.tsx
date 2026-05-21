const customers = [
  { id: 1, name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", orders: 5, spent: "₹8,490" },
  { id: 2, name: "Rahul Gupta", email: "rahul@email.com", phone: "+91 87654 32109", orders: 3, spent: "₹5,297" },
  { id: 3, name: "Sneha Patel", email: "sneha@email.com", phone: "+91 76543 21098", orders: 2, spent: "₹4,998" },
  { id: 4, name: "Vikram Singh", email: "vikram@email.com", phone: "+91 65432 10987", orders: 4, spent: "₹6,196" },
  { id: 5, name: "Meera Kapoor", email: "meera@email.com", phone: "+91 54321 09876", orders: 2, spent: "₹1,048" },
  { id: 6, name: "Ananya Desai", email: "ananya@email.com", phone: "+91 43210 98765", orders: 1, spent: "₹2,999" },
];

const AdminCustomers = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total Orders</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-[#1a1208]">{c.name}</td>
                <td className="px-6 py-3 text-gray-600">{c.email}</td>
                <td className="px-6 py-3 text-gray-600">{c.phone}</td>
                <td className="px-6 py-3 text-gray-600">{c.orders}</td>
                <td className="px-6 py-3 font-medium text-[#1a1208]">{c.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminCustomers;
