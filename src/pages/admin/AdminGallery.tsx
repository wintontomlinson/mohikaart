import { GALLERY_IMAGES } from "@/lib/products";
import { Plus, Trash2 } from "lucide-react";

const AdminGallery = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{GALLERY_IMAGES.length} images</p>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1208] text-white text-sm font-medium rounded-lg hover:bg-[#1a1208]/90">
        <Plus className="w-4 h-4" /> Upload Images
      </button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {GALLERY_IMAGES.map((img, i) => (
        <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 text-[10px] font-medium rounded-full capitalize">
            {img.category}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default AdminGallery;
