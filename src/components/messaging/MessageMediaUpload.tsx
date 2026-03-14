import { useState, useRef, useCallback } from "react";
import { Paperclip, X, FileText, Film } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
];
const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const COMPRESS_THRESHOLD = 2 * 1024 * 1024; // 2 MB

interface PendingMedia {
  file: File;
  preview?: string;
  type: "image" | "video" | "document";
}

interface Props {
  onMediaReady: (media: { url: string; type: string; name: string; size: number } | null) => void;
  pending: PendingMedia | null;
  setPending: (m: PendingMedia | null) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
  progress: number;
  setProgress: (v: number) => void;
}

function getMediaCategory(mime: string): "image" | "video" | "document" {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "document";
}

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDim = 1920;
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function MessageMediaUpload({ onMediaReady, pending, setPending, uploading, setUploading, progress, setProgress }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (e.target) e.target.value = "";

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Format non supporté. Formats acceptés : PDF, DOC, DOCX, JPG, PNG, GIF, MP4");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Fichier trop volumineux (max 50 Mo)");
      return;
    }

    const category = getMediaCategory(file.type);
    let processedFile = file;

    // Auto-compress images > 2 MB
    if (category === "image" && file.type !== "image/gif" && file.size > COMPRESS_THRESHOLD) {
      processedFile = await compressImage(file);
    }

    const preview = category === "image" ? URL.createObjectURL(processedFile) : undefined;
    setPending({ file: processedFile, preview, type: category });
  }, [setPending]);

  const handleUpload = useCallback(async (): Promise<{ url: string; type: string; name: string; size: number } | null> => {
    if (!pending) return null;
    setUploading(true);
    setProgress(10);

    try {
      const ext = pending.file.name.split(".").pop() || "bin";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      setProgress(30);
      const { error } = await supabase.storage
        .from("messagerie-medias")
        .upload(path, pending.file, { upsert: false });

      if (error) throw error;
      setProgress(80);

      const { data: urlData } = supabase.storage
        .from("messagerie-medias")
        .getPublicUrl(path);

      setProgress(100);
      const result = {
        url: urlData.publicUrl,
        type: pending.type,
        name: pending.file.name,
        size: pending.file.size,
      };
      onMediaReady(result);
      setPending(null);
      return result;
    } catch (err: any) {
      toast.error("Erreur upload : " + (err.message || "Erreur inconnue"));
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [pending, onMediaReady, setPending, setUploading, setProgress]);

  const removePending = () => {
    if (pending?.preview) URL.revokeObjectURL(pending.preview);
    setPending(null);
    onMediaReady(null);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4"
        className="hidden"
        onChange={handleFileSelect}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="glass-button p-2.5 text-muted-foreground hover:text-foreground transition-colors"
        title="Joindre un fichier"
        disabled={uploading}
      >
        <Paperclip className="h-4 w-4" />
      </button>

      {/* Pending file preview */}
      {pending && (
        <div className="absolute bottom-full left-0 right-0 p-2 mb-1">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/60 text-sm">
            {pending.type === "image" && pending.preview ? (
              <img src={pending.preview} alt="" className="h-10 w-10 rounded object-cover" />
            ) : pending.type === "video" ? (
              <Film className="h-5 w-5 text-muted-foreground" />
            ) : (
              <FileText className="h-5 w-5 text-muted-foreground" />
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium">{pending.file.name}</p>
              <p className="text-[10px] text-muted-foreground">{formatSize(pending.file.size)}</p>
            </div>
            {uploading ? (
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            ) : (
              <button onClick={removePending} className="p-1 hover:bg-muted rounded">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Expose upload function */}
      <input type="hidden" data-upload-fn="" ref={(el) => {
        if (el) (el as any).__uploadFn = handleUpload;
      }} />
    </>
  );
}

/** Inline media renderer for message bubbles */
export function MessageMediaInline({ mediaUrl, mediaType, mediaName, mediaSize }: {
  mediaUrl?: string | null;
  mediaType?: string | null;
  mediaName?: string | null;
  mediaSize?: number | null;
}) {
  if (!mediaUrl) return null;

  if (mediaType === "image") {
    return (
      <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="block mt-1.5">
        <img src={mediaUrl} alt={mediaName || "Image"} className="max-w-[300px] rounded-lg" loading="lazy" />
      </a>
    );
  }

  if (mediaType === "video") {
    return (
      <div className="mt-1.5">
        <video src={mediaUrl} controls className="max-w-[300px] rounded-lg" preload="metadata" />
      </div>
    );
  }

  // Document (PDF, DOC, etc.)
  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 mt-1.5 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors text-xs"
    >
      <FileText className="h-4 w-4 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{mediaName || "Document"}</p>
        {mediaSize && <p className="text-muted-foreground">{formatSize(mediaSize)}</p>}
      </div>
    </a>
  );
}
