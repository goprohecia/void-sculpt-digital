import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, FolderOpen, Receipt, MessageSquare, FileText, LifeBuoy, CheckCheck, UserPlus, Smartphone } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Notification } from "@/data/mockData";

const typeIcons: Record<string, { icon: typeof Bell; className: string }> = {
  dossier: { icon: FolderOpen, className: "text-[hsl(200,100%,60%)]" },
  facture: { icon: Receipt, className: "text-[hsl(155,100%,55%)]" },
  message: { icon: MessageSquare, className: "text-[hsl(var(--primary))]" },
  devis: { icon: FileText, className: "text-[hsl(45,93%,60%)]" },
  ticket: { icon: LifeBuoy, className: "text-[hsl(var(--neon-red))]" },
  assignation: { icon: UserPlus, className: "text-[hsl(280,100%,70%)]" },
};

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
}

export function NotificationPanel({ notifications, onMarkAllRead, onMarkRead }: NotificationPanelProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const nonLues = notifications.filter((n) => !n.lu).length;

  const handleMarkAll = () => {
    onMarkAllRead?.();
  };

  const handleClick = (notif: Notification) => {
    onMarkRead?.(notif.id);
    setOpen(false);
    navigate(notif.lien);
  };

  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
    } catch {
      return date;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {nonLues > 0 && (
            <motion.span
              key={nonLues}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground"
            >
              {nonLues}
            </motion.span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 border-border/50 bg-card" sideOffset={8}>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <h4 className="text-sm font-semibold">Notifications</h4>
            {nonLues > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tout marquer lu
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">Aucune notification</p>
              ) : (
                notifications.slice(0, 20).map((notif, i) => {
                  const typeConfig = typeIcons[notif.type] || typeIcons.message;
                  const Icon = typeConfig.icon;
                  return (
                    <motion.button
                      key={notif.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.2 }}
                      onClick={() => handleClick(notif)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0 ${!notif.lu ? "bg-primary/5" : ""}`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-md bg-muted/80 ${typeConfig.className}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium truncate">{notif.titre}</span>
                          {!notif.lu && <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{notif.description}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{formatDate(notif.date)}</p>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
