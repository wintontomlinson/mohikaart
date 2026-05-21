import { Star, Check, X, Trash2 } from "lucide-react";

const reviews = [
  { id: 1, customer: "Priya S.", product: "Name Keychain", rating: 5, text: "Absolutely beautiful! Even more stunning in person.", status: "Approved" },
  { id: 2, customer: "Ananya M.", product: "Resin Tray", rating: 5, text: "The resin tray is a showstopper. Packaging was super premium!", status: "Approved" },
  { id: 3, customer: "Sneha & Rahul", product: "Wedding Keepsake", rating: 5, text: "We will treasure it forever. Worth every rupee!", status: "Approved" },
  { id: 4, customer: "Vikram T.", product: "Photo Frame", rating: 5, text: "My wife cried happy tears. Highly recommended!", status: "Pending" },
  { id: 5, customer: "Meera K.", product: "Bookmark Set", rating: 4, text: "Gorgeous quality, already placing my second order!", status: "Pending" },
];

const AdminReviews = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Review</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-[#1a1208]">{r.customer}</td>
                <td className="px-6 py-3 text-gray-600">{r.product}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#c9a84c] text-[#c9a84c]" />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-600 max-w-[200px] truncate">{r.text}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    r.status === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminReviews;
