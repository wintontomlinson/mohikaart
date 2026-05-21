import { useState } from "react";
import { products } from "@/lib/products";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.categorySlug === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a84c] w-64"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a84c]"
          >
            <option value="all">All Categories</option>
            <option value="keychain">Keychains</option>
            <option value="frame">Frames</option>
            <option value="wedding">Wedding</option>
            <option value="tray">Trays</option>
            <option value="coaster">Coasters</option>
            <option value="bookmark">Bookmarks</option>
            <option value="hamper">Hampers</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1208] text-white text-sm font-medium rounded-lg hover:bg-[#1a1208]/90">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">MRP</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Badge</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-[#1a1208] max-w-[200px] truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600 capitalize">{p.categorySlug}</td>
                  <td className="px-6 py-3 font-medium">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3 text-gray-400">₹{p.mrp.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#c9a84c]/10 text-[#c9a84c]">
                      {p.badge}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-green-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600">
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
};

export default AdminProducts;
