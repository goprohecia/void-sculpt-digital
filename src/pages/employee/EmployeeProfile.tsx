import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCircle, Bell, Smartphone, Mail } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useSectorRoleLabels } from "@/hooks/use-sector-role-labels";
import { toast } from "sonner";

export default function EmployeeProfile() {
  const { user } = useDemoAuth();
  const { employeeLabel } = useSectorRoleLabels();

  const [notifInApp, setNotifInApp] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [telephone, setTelephone] = useState("");

  const handleSavePrefs = () => {
    toast.success("Préférences de notifications enregistrées");
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6 max-w-2xl" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-primary" />
              Mon profil
            </h1>
            <p className="text-muted-foreground text-sm">Vos informations personnelles</p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {user?.nom?.charAt(0) || "S"}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{user?.nom || "Salarié"}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-1">Rôle : {user?.role || "salarié"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Préférences de notifications */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Préférences de notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* In-app toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Notifications in-app</Label>
                      <p className="text-xs text-muted-foreground">Recevoir les notifications dans l'application</p>
                    </div>
                  </div>
                  <Switch checked={notifInApp} onCheckedChange={setNotifInApp} />
                </div>

                {/* SMS toggle */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Notifications SMS</Label>
                        <p className="text-xs text-muted-foreground">Recevoir un SMS à chaque nouvelle assignation</p>
                      </div>
                    </div>
                    <Switch checked={notifSms} onCheckedChange={setNotifSms} />
                  </div>

                  {notifSms && (
                    <div className="ml-7 space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Numéro de téléphone</Label>
                      <Input
                        type="tel"
                        placeholder="06 12 34 56 78"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="max-w-xs"
                      />
                    </div>
                  )}
                </div>

                <Button size="sm" onClick={handleSavePrefs} className="mt-2">
                  Enregistrer les préférences
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
