import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function EmployeeRelances() {
  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Relances
          </h1>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suivi des relances</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Consultez les relances en cours pour vos clients.</p>
            </CardContent>
          </Card>
        </div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
