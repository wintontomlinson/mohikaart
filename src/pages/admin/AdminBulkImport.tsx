import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload, FileSpreadsheet, Check, AlertTriangle, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Product = {
  id?: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  category_slug: string | null;
  badge: string | null;
  featured: boolean;
  in_stock: boolean;
  stock_qty: number;
  sort_order: number;
};

type ImportRow = {
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  category_slug: string | null;
  badge: string | null;
  featured: boolean;
  in_stock: boolean;
  stock_qty: number;
  sort_order: number;
};

type ImportResult = {
  created: number;
  updated: number;
  errors: number;
  errorMessages: string[];
};

const CSV_HEADERS = ["name", "slug", "price", "original_price", "category_slug", "badge", "featured", "in_stock", "stock_qty", "sort_order"];

const AdminBulkImport = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<ImportRow[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from("products").select("*").order("sort_order");
        setProducts((data ?? []) as Product[]);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const exportCSV = () => {
    const rows = products.map((p) => [
      p.name,
      p.slug,
      p.price,
      p.original_price ?? "",
      p.category_slug ?? "",
      p.badge ?? "",
      p.featured ? "true" : "false",
      p.in_stock ? "true" : "false",
      (p as any).stock_qty ?? 0,
      p.sort_order,
    ]);

    const csv = [CSV_HEADERS, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Products exported as CSV");
  };

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());

    return lines.slice(1).map((line) => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
      values.push(current.trim());

      const row: any = {};
      headers.forEach((h, i) => {
        row[h] = values[i]?.replace(/^"|"$/g, "") ?? "";
      });

      return {
        name: row.name || "",
        slug: row.slug || "",
        price: parseFloat(row.price) || 0,
        original_price: row.original_price ? parseFloat(row.original_price) : null,
        category_slug: row.category_slug || null,
        badge: row.badge || null,
        featured: row.featured === "true" || row.featured === "1",
        in_stock: row.in_stock !== "false" && row.in_stock !== "0",
        stock_qty: parseInt(row.stock_qty) || 0,
        sort_order: parseInt(row.sort_order) || 0,
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        const rows = parseCSV(text);
        if (rows.length === 0) {
          toast.error("No valid rows found in CSV");
          return;
        }
        setPreviewData(rows);
        setImportResult(null);
        toast.success(`Parsed ${rows.length} rows from CSV`);
      } catch (err: any) {
        toast.error("Failed to parse CSV: " + (err.message || "Unknown error"));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const doImport = async () => {
    if (!previewData || previewData.length === 0) return;

    setImporting(true);
    const result: ImportResult = { created: 0, updated: 0, errors: 0, errorMessages: [] };

    const existingSlugs = new Set(products.map((p) => p.slug));

    for (const row of previewData) {
      if (!row.name || !row.slug) {
        result.errors++;
        result.errorMessages.push(`Skipped row: missing name or slug`);
        continue;
      }

      const payload = {
        name: row.name,
        slug: row.slug,
        price: row.price,
        original_price: row.original_price,
        category_slug: row.category_slug,
        badge: row.badge,
        featured: row.featured,
        in_stock: row.in_stock,
        sort_order: row.sort_order,
      };

      if (existingSlugs.has(row.slug)) {
        // Update existing
        const { error } = await supabase.from("products").update(payload).eq("slug", row.slug);
        if (error) {
          result.errors++;
          result.errorMessages.push(`Error updating "${row.slug}": ${error.message}`);
        } else {
          result.updated++;
        }
      } else {
        // Create new
        const { error } = await supabase.from("products").insert(payload);
        if (error) {
          result.errors++;
          result.errorMessages.push(`Error creating "${row.slug}": ${error.message}`);
        } else {
          result.created++;
          existingSlugs.add(row.slug);
        }
      }
    }

    setImporting(false);
    setImportResult(result);
    setPreviewData(null);

    if (result.errors === 0) {
      toast.success(`Import complete: ${result.created} created, ${result.updated} updated`);
    } else {
      toast.error(`Import completed with ${result.errors} errors`);
    }

    // Reload products
    const { data } = await supabase.from("products").select("*").order("sort_order");
    setProducts((data ?? []) as Product[]);
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Import / Export</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bulk manage your product catalog via CSV files
        </p>
      </div>

      {/* Export Section */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold" style={{ color: "#1a1208" }}>Export Products</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Download all {products.length} products as a CSV file. You can edit this file and re-import it.
            </p>
            <button
              onClick={exportCSV}
              disabled={loading || products.length === 0}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ background: "#1a1208", color: "#fdf9f0" }}
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold" style={{ color: "#1a1208" }}>Import Products</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a CSV file to bulk create or update products. Existing products (matched by slug) will be updated.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#f5f0e8] transition-colors bg-white/70"
              >
                <FileSpreadsheet className="w-4 h-4" /> Choose CSV File
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              Expected columns: {CSV_HEADERS.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      {previewData && (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden mb-6">
          <div className="p-5 border-b border-[#e5e0d8]/40 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "#1a1208" }}>
                Preview ({previewData.length} rows)
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Review the data below before importing
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewData(null)}
                className="px-3 py-1.5 rounded-lg border border-[#e5e0d8] text-xs hover:bg-[#f5f0e8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doImport}
                disabled={importing}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                style={{ background: "#1a1208" }}
              >
                {importing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                {importing ? "Importing…" : "Confirm Import"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#e5e0d8]/40">
                  {CSV_HEADERS.map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 50).map((row, i) => {
                  const exists = products.some((p) => p.slug === row.slug);
                  return (
                    <tr key={i} className="border-b border-[#e5e0d8]/20 hover:bg-[#f8f5f0]">
                      <td className="px-3 py-2 font-medium" style={{ color: "#1a1208" }}>{row.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.slug}</td>
                      <td className="px-3 py-2">{row.price}</td>
                      <td className="px-3 py-2">{row.original_price ?? "—"}</td>
                      <td className="px-3 py-2">{row.category_slug ?? "—"}</td>
                      <td className="px-3 py-2">{row.badge ?? "—"}</td>
                      <td className="px-3 py-2">{row.featured ? "Yes" : "No"}</td>
                      <td className="px-3 py-2">{row.in_stock ? "Yes" : "No"}</td>
                      <td className="px-3 py-2">{row.stock_qty}</td>
                      <td className="px-3 py-2">{row.sort_order}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${exists ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                          {exists ? "Update" : "Create"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {previewData.length > 50 && (
              <div className="px-4 py-3 text-xs text-muted-foreground text-center border-t border-[#e5e0d8]/30">
                Showing first 50 of {previewData.length} rows
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#1a1208" }}>Import Results</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
              <div className="text-2xl font-bold text-emerald-700">{importResult.created}</div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-600 font-semibold mt-1">Created</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
              <div className="text-2xl font-bold text-blue-700">{importResult.updated}</div>
              <div className="text-[11px] uppercase tracking-wider text-blue-600 font-semibold mt-1">Updated</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
              <div className="text-2xl font-bold text-red-700">{importResult.errors}</div>
              <div className="text-[11px] uppercase tracking-wider text-red-600 font-semibold mt-1">Errors</div>
            </div>
          </div>
          {importResult.errorMessages.length > 0 && (
            <div className="space-y-1.5 mt-4">
              {importResult.errorMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {msg}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setImportResult(null)}
            className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBulkImport;
