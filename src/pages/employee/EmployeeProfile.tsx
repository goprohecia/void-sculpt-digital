import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";

export default function EmployeeProfile() {
  const { user } = useDemoAuth();

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
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
