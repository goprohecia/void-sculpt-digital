import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, FolderOpen, CalendarDays, MessageSquare } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { useSectorRoleLabels } from "@/hooks/use-sector-role-labels";

export default function EmployeeDashboard() {
  const { user } = useDemoAuth();
  const { employeeLabel } = useSectorRoleLabels();

  const stats = [
    { title: "Dossiers assignés", value: "5", icon: FolderOpen, color: "text-blue-400" },
    { title: "RDV aujourd'hui", value: "2", icon: CalendarDays, color: "text-green-400" },
    { title: "Messages non lus", value: "3", icon: MessageSquare, color: "text-amber-400" },
  ];

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              Bonjour, {user?.nom || employeeLabel} 👋
            </h1>
            <p className="text-muted-foreground text-sm">Voici votre tableau de bord</p>
          </motion.div>

          <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Aucune activité récente pour le moment.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
