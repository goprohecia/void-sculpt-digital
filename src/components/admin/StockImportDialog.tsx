import { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import * as XLSX from "xlsx";

const SYSTEM_FIELDS = [
  { value: "__skip__", label: "— Ignorer —" },
  { value: "reference", label: "Référence" },
  { value: "nom", label: "Nom produit" },
  { value: "description", label: "Description" },
  { value: "prix_achat", label: "Prix d'achat" },
  { value: "prix_vente", label: "Prix de vente" },
  { value: "quantite_stock", label: "Quantité stock" },
  { value: "seuil_alerte", label: "Seuil d'alerte" },
  { value: "categorie", label: "Catégorie" },
  { value: "fournisseur", label: "Fournisseur" },
  { value: "sku", label: "SKU" },
  { value: "unite", label: "Unité" },
] as const;

type SystemField = (typeof SYSTEM_FIELDS)[number]["value"];

const MAPPING_HINTS: Record<string, SystemField[]> = {
  ref: ["reference"],
  référence: ["reference"],
  reference: ["reference"],
  code: ["reference"],
  sku: ["sku"],
  nom: ["nom"],
  name: ["nom"],
  produit: ["nom"],
  product: ["nom"],
  description: ["description"],
  desc: ["description"],
  achat: ["prix_achat"],
  "prix achat": ["prix_achat"],
  "prix_achat": ["prix_achat"],
  cost: ["prix_achat"],
  "purchase price": ["prix_achat"],
  vente: ["prix_vente"],
  "prix vente": ["prix_vente"],
  "prix_vente": ["prix_vente"],
  price: ["prix_vente"],
  prix: ["prix_vente"],
  "selling price": ["prix_vente"],
  stock: ["quantite_stock"],
  quantité: ["quantite_stock"],
  quantite: ["quantite_stock"],
  qty: ["quantite_stock"],
  quantity: ["quantite_stock"],
  seuil: ["seuil_alerte"],
  alerte: ["seuil_alerte"],
  alert: ["seuil_alerte"],
  catégorie: ["categorie"],
  categorie: ["categorie"],
  category: ["categorie"],
  fournisseur: ["fournisseur"],
  supplier: ["fournisseur"],
  unité: ["unite"],
  unite: ["unite"],
  unit: ["unite"],
};

function guessField(header: string): SystemField {
  const h = header.toLowerCase().trim();
  for (const [keyword, fields] of Object.entries(MAPPING_HINTS)) {
    if (h === keyword || h.includes(keyword)) return fields[0];
  }
  return "__skip__";
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const sep = text.indexOf(";") !== -1 ? ";" : ",";
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(sep).map((h) => h.replace(/^"|"$/g, "").trim());
  const rows = lines.slice(1).map((l) => l.split(sep).map((c) => c.replace(/^"|"$/g, "").trim()));
  return { headers, rows };
}

function parseExcel(buffer: ArrayBuffer): { headers: string[]; rows: string[][] } {
  const wb = XLSX.read(buffer, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  if (data.length === 0) return { headers: [], rows: [] };
  const headers = data[0].map((h) => String(h).trim());
  const rows = data.slice(1).map((r) => r.map((c) => String(c).trim()));
  return { headers, rows };
}

interface StockImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addProduit: (p: any) => Promise<void>;
  addCategory: (c: any) => Promise<void>;
  addFournisseur: (f: any) => Promise<void>;
  categories: any[];
  fournisseurs: any[];
  existingRefs: string[];
}

type Step = "upload" | "mapping" | "preview" | "importing" | "done";

export function StockImportDialog({
  open,
  onOpenChange,
  addProduit,
  addCategory,
  addFournisseur,
  categories,
  fournisseurs,
  existingRefs,
}: StockImportDialogProps) {
  const [step, setStep] = useState<Step>("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<number, SystemField>>({});
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({ products: 0, categories: 0, suppliers: 0, skipped: 0, errors: 0 });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep("upload");
    setHeaders([]);
    setRows([]);
    setMapping({});
    setProgress(0);
    setResults({ products: 0, categories: 0, suppliers: 0, skipped: 0, errors: 0 });
  }, []);

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleFile = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    let parsed: { headers: string[]; rows: string[][] };
    if (ext === "csv" || ext === "txt") {
      const text = await file.text();
      parsed = parseCSV(text);
    } else {
      const buffer = await file.arrayBuffer();
      parsed = parseExcel(buffer);
    }
    if (parsed.headers.length === 0) return;
    setHeaders(parsed.headers);
    setRows(parsed.rows);
    const autoMapping: Record<number, SystemField> = {};
    parsed.headers.forEach((h, i) => {
      autoMapping[i] = guessField(h);
    });
    setMapping(autoMapping);
    setStep("mapping");
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const getMappedField = (field: SystemField) => {
    return Object.entries(mapping).find(([, v]) => v === field)?.[0];
  };

  const hasRequiredFields = getMappedField("reference") !== undefined && getMappedField("nom") !== undefined;

  const buildPreviewRows = () => {
    return rows.slice(0, 5).map((row) => {
      const obj: Record<string, string> = {};
      Object.entries(mapping).forEach(([colIdx, field]) => {
        if (field !== "__skip__") obj[field] = row[parseInt(colIdx)] || "";
      });
      return obj;
    });
  };

  const handleImport = async () => {
    setStep("importing");
    setProgress(0);
    const res = { products: 0, categories: 0, suppliers: 0, skipped: 0, errors: 0 };

    // Build category & supplier lookup
    const catMap = new Map<string, string>();
    categories.forEach((c: any) => catMap.set(c.nom.toLowerCase(), c.id));
    const fournMap = new Map<string, string>();
    fournisseurs.forEach((f: any) => fournMap.set(f.nom.toLowerCase(), f.id));

    const catField = getMappedField("categorie");
    const fournField = getMappedField("fournisseur");

    // Pre-create missing categories & suppliers
    const uniqueCats = new Set<string>();
    const uniqueFourns = new Set<string>();
    rows.forEach((row) => {
      if (catField) {
        const v = row[parseInt(catField)]?.trim();
        if (v && !catMap.has(v.toLowerCase())) uniqueCats.add(v);
      }
      if (fournField) {
        const v = row[parseInt(fournField)]?.trim();
        if (v && !fournMap.has(v.toLowerCase())) uniqueFourns.add(v);
      }
    });

    for (const catName of uniqueCats) {
      try {
        await addCategory({ nom: catName });
        res.categories++;
        catMap.set(catName.toLowerCase(), "__new__" + catName);
      } catch { /* skip */ }
    }
    for (const fName of uniqueFourns) {
      try {
        await addFournisseur({ nom: fName });
        res.suppliers++;
        fournMap.set(fName.toLowerCase(), "__new__" + fName);
      } catch { /* skip */ }
    }

    // Now insert products
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const obj: Record<string, string> = {};
      Object.entries(mapping).forEach(([colIdx, field]) => {
        if (field !== "__skip__") obj[field] = row[parseInt(colIdx)] || "";
      });

      if (!obj.reference || !obj.nom) {
        res.skipped++;
        setProgress(Math.round(((i + 1) / rows.length) * 100));
        continue;
      }

      if (existingRefs.includes(obj.reference)) {
        res.skipped++;
        setProgress(Math.round(((i + 1) / rows.length) * 100));
        continue;
      }

      try {
        const catId = obj.categorie ? catMap.get(obj.categorie.toLowerCase()) : undefined;
        const fournId = obj.fournisseur ? fournMap.get(obj.fournisseur.toLowerCase()) : undefined;

        // Resolve IDs for newly created categories/suppliers
        let resolvedCatId = catId?.startsWith("__new__") ? undefined : catId;
        let resolvedFournId = fournId?.startsWith("__new__") ? undefined : fournId;

        await addProduit({
          reference: obj.reference,
          nom: obj.nom,
          description: obj.description || undefined,
          prix_achat: parseFloat(obj.prix_achat) || 0,
          prix_vente: parseFloat(obj.prix_vente) || 0,
          quantite_stock: parseInt(obj.quantite_stock) || 0,
          seuil_alerte: parseInt(obj.seuil_alerte) || 5,
          sku: obj.sku || undefined,
          unite: obj.unite || undefined,
          categorie_id: resolvedCatId || undefined,
          fournisseur_id: resolvedFournId || undefined,
        });
        res.products++;
      } catch {
        res.errors++;
      }
      setProgress(Math.round(((i + 1) / rows.length) * 100));
    }

    setResults(res);
    setStep("done");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Importer des produits
          </DialogTitle>
          <DialogDescription>
            {step === "upload" && "Glissez un fichier CSV ou Excel pour pré-remplir votre stock."}
            {step === "mapping" && "Associez chaque colonne du fichier à un champ du système."}
            {step === "preview" && "Vérifiez l'aperçu avant de lancer l'import."}
            {step === "importing" && "Import en cours…"}
            {step === "done" && "Import terminé !"}
          </DialogDescription>
        </DialogHeader>

        {/* Step: Upload */}
        {step === "upload" && (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm font-medium">Glissez votre fichier ici</p>
            <p className="text-xs text-muted-foreground mt-1">ou cliquez pour sélectionner (CSV, XLSX, XLS)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.txt"
              className="hidden"
              onChange={onFileSelect}
            />
          </div>
        )}

        {/* Step: Mapping */}
        {step === "mapping" && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">{rows.length} lignes détectées · {headers.length} colonnes</div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {headers.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-medium min-w-[140px] truncate" title={h}>{h}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Select value={mapping[i] || "__skip__"} onValueChange={(v) => setMapping((m) => ({ ...m, [i]: v as SystemField }))}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SYSTEM_FIELDS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            {!hasRequiredFields && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Les champs Référence et Nom sont obligatoires.
              </p>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("upload")} className="gap-1"><ArrowLeft className="h-3.5 w-3.5" /> Retour</Button>
              <Button onClick={() => setStep("preview")} disabled={!hasRequiredFields} className="gap-1">Aperçu <ArrowRight className="h-3.5 w-3.5" /></Button>
            </DialogFooter>
          </div>
        )}

        {/* Step: Preview */}
        {step === "preview" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Aperçu des 5 premières lignes :</p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {SYSTEM_FIELDS.filter((f) => f.value !== "__skip__" && getMappedField(f.value) !== undefined).map((f) => (
                      <TableHead key={f.value} className="text-xs whitespace-nowrap">{f.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buildPreviewRows().map((row, i) => (
                    <TableRow key={i}>
                      {SYSTEM_FIELDS.filter((f) => f.value !== "__skip__" && getMappedField(f.value) !== undefined).map((f) => (
                        <TableCell key={f.value} className="text-xs">{row[f.value] || "—"}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground">{rows.length} produits seront importés. Les doublons (même référence) seront ignorés.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("mapping")} className="gap-1"><ArrowLeft className="h-3.5 w-3.5" /> Mapping</Button>
              <Button onClick={handleImport} className="gap-1"><Upload className="h-3.5 w-3.5" /> Lancer l'import</Button>
            </DialogFooter>
          </div>
        )}

        {/* Step: Importing */}
        {step === "importing" && (
          <div className="space-y-4 py-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">{progress}% — Import en cours…</p>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-semibold">Import terminé</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">{results.products} produits importés</Badge>
              {results.categories > 0 && <Badge variant="secondary">{results.categories} catégories créées</Badge>}
              {results.suppliers > 0 && <Badge variant="secondary">{results.suppliers} fournisseurs ajoutés</Badge>}
              {results.skipped > 0 && <Badge variant="outline">{results.skipped} ignorés (doublons/incomplets)</Badge>}
              {results.errors > 0 && <Badge variant="destructive">{results.errors} erreurs</Badge>}
            </div>
            <DialogFooter>
              <Button onClick={() => handleClose(false)}>Fermer</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
