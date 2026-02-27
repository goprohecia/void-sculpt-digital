import { useState } from "react";
import { useTags, useClientTags } from "@/hooks/use-produits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag, Plus, X, Palette } from "lucide-react";
import { toast } from "sonner";

const TAG_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#06b6d4",
];

interface ClientTagManagerProps {
  clientId: string;
  compact?: boolean;
}

export function ClientTagManager({ clientId, compact = false }: ClientTagManagerProps) {
  const { tags, addTag } = useTags();
  const { clientTags, addClientTag, removeClientTag } = useClientTags(clientId);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [open, setOpen] = useState(false);

  const assignedTagIds = clientTags.map((ct: any) => ct.tag_id);

  const handleAssign = async (tagId: string) => {
    if (assignedTagIds.includes(tagId)) return;
    try {
      await addClientTag({ client_id: clientId, tag_id: tagId });
      toast.success("Tag ajouté");
    } catch {
      toast.error("Erreur lors de l'ajout du tag");
    }
  };

  const handleRemove = async (clientTagId: string) => {
    try {
      await removeClientTag(clientTagId);
      toast.success("Tag retiré");
    } catch {
      toast.error("Erreur lors du retrait du tag");
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      await addTag({ nom: newTagName.trim(), couleur: newTagColor });
      setNewTagName("");
      toast.success("Tag créé");
    } catch {
      toast.error("Erreur lors de la création du tag");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {clientTags.map((ct: any) => (
        <Badge
          key={ct.id}
          variant="outline"
          className="gap-1 text-xs border-0 pr-1"
          style={{ backgroundColor: `${ct.tags?.couleur || "#6366f1"}20`, color: ct.tags?.couleur || "#6366f1" }}
        >
          {ct.tags?.nom || "Tag"}
          {!compact && (
            <button onClick={() => handleRemove(ct.id)} className="ml-0.5 hover:opacity-70">
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md border border-dashed border-border/50 px-1.5 py-0.5">
            <Tag className="h-3 w-3" />
            {!compact && <span>Tags</span>}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 space-y-3" align="start">
          <p className="text-xs font-semibold text-muted-foreground">Tags disponibles</p>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-auto">
            {tags.length === 0 && (
              <p className="text-xs text-muted-foreground italic">Aucun tag créé</p>
            )}
            {tags.map((tag: any) => {
              const isAssigned = assignedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => !isAssigned && handleAssign(tag.id)}
                  disabled={isAssigned}
                  className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 transition-all ${
                    isAssigned
                      ? "opacity-40 cursor-default"
                      : "hover:opacity-80 cursor-pointer"
                  }`}
                  style={{
                    backgroundColor: `${tag.couleur || "#6366f1"}20`,
                    color: tag.couleur || "#6366f1",
                  }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tag.couleur || "#6366f1" }} />
                  {tag.nom}
                </button>
              );
            })}
          </div>

          <div className="border-t border-border/30 pt-2 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Créer un tag</p>
            <div className="flex gap-1.5">
              <Input
                placeholder="Nom du tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="h-7 text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="h-7 w-7 rounded border border-border/50 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: newTagColor }}
                  >
                    <Palette className="h-3 w-3 text-white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" side="right">
                  <div className="grid grid-cols-5 gap-1.5">
                    {TAG_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setNewTagColor(c)}
                        className={`h-6 w-6 rounded-full border-2 transition-all ${newTagColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button size="sm" className="h-7 px-2" onClick={handleCreateTag} disabled={!newTagName.trim()}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Inline read-only tag badges for table rows */
export function ClientTagBadges({ clientId }: { clientId: string }) {
  const { clientTags } = useClientTags(clientId);

  if (clientTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {clientTags.slice(0, 3).map((ct: any) => (
        <span
          key={ct.id}
          className="text-[10px] rounded-full px-1.5 py-0.5"
          style={{
            backgroundColor: `${ct.tags?.couleur || "#6366f1"}20`,
            color: ct.tags?.couleur || "#6366f1",
          }}
        >
          {ct.tags?.nom}
        </span>
      ))}
      {clientTags.length > 3 && (
        <span className="text-[10px] text-muted-foreground">+{clientTags.length - 3}</span>
      )}
    </div>
  );
}
