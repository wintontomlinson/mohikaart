import { useEffect, useRef } from "react";
import { X, AlertTriangle, Trash2, LogOut, Power } from "lucide-react";

type Variant = "danger" | "warning" | "info";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  loading?: boolean;
};

const icons: Record<Variant, typeof AlertTriangle> = {
  danger: Trash2,
  warning: AlertTriangle,
  info: Power,
};

const colors: Record<Variant, { bg: string; icon: string; btn: string }> = {
  danger: { bg: "bg-red-50", icon: "text-red-500", btn: "bg-red-600 hover:bg-red-700 text-white" },
  warning: { bg: "bg-amber-50", icon: "text-amber-600", btn: "bg-amber-600 hover:bg-amber-700 text-white" },
  info: { bg: "bg-blue-50", icon: "text-blue-600", btn: "bg-[#1a1208] hover:bg-[#2d2015] text-[#fdf9f0]" },
};

const ConfirmModal = ({
  open, onClose, onConfirm, title, description,
  confirmLabel = "Confirm", cancelLabel = "Cancel",
  variant = "danger", loading = false,
}: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const Icon = icons[variant];
  const c = colors[variant];

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-[0_24px_80px_-12px_rgba(26,18,8,0.18)] border border-[#e5e0d8]/60 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg hover:bg-[#f5f0e8] flex items-center justify-center text-muted-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="p-6 text-center">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full ${c.bg} flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-5 h-5 ${c.icon}`} />
          </div>

          <h3 className="font-display text-lg mb-1.5" style={{ color: "#1a1208" }}>{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">{description}</p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#f8f5f0] transition-colors disabled:opacity-50"
            style={{ color: "#3d2b1f" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${c.btn}`}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
