import { useState } from "react";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    whatsapp: "+91 9999999999",
    email: "hello@mohikaart.com",
    instagram: "https://instagram.com/mohikaart",
    freeShippingThreshold: "999",
    deliveryDays: "5-7",
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    toast.success("Settings saved!");
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-3">
        {["general", "contact", "social", "shipping"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
              activeTab === tab ? "bg-[#1a1208] text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5 max-w-xl">
        {activeTab === "general" && (
          <>
            <h3 className="font-medium text-[#1a1208]">General Settings</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Store Name</label>
              <input value="Mohika Art" disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Currency</label>
              <input value="INR (₹)" disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50" />
            </div>
          </>
        )}

        {activeTab === "contact" && (
          <>
            <h3 className="font-medium text-[#1a1208]">Contact Settings</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">WhatsApp Number</label>
              <input
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email Address</label>
              <input
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
          </>
        )}

        {activeTab === "social" && (
          <>
            <h3 className="font-medium text-[#1a1208]">Social Media</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Instagram URL</label>
              <input
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
          </>
        )}

        {activeTab === "shipping" && (
          <>
            <h3 className="font-medium text-[#1a1208]">Shipping Settings</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Free Shipping Threshold (₹)</label>
              <input
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Delivery Days</label>
              <input
                value={settings.deliveryDays}
                onChange={(e) => setSettings({ ...settings, deliveryDays: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#1a1208] text-white text-sm font-medium rounded-lg hover:bg-[#1a1208]/90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
