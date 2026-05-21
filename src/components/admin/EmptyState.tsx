import { Package, ShoppingCart, Mail, MessageSquareQuote } from "lucide-react";

type Props = {
  icon?: any;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
};

const EmptyState = ({ icon: Icon = Package, title, description, action }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
      style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))", border: "1px solid rgba(201,168,76,0.15)" }}>
      <Icon className="w-7 h-7" style={{ color: "#c9a84c" }} />
    </div>
    <h3 className="font-display text-lg mb-1.5" style={{ color: "#1a1208" }}>{title}</h3>
    <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">{description}</p>
    {action && (
      <button onClick={action.onClick}
        className="mt-5 px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-wider font-semibold transition-all hover:scale-[1.02] shadow-md"
        style={{ background: "#1a1208", color: "#fdf9f0" }}>
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
