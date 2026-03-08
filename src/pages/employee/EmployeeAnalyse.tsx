import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function EmployeeAnalyse() {
  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analyse
          </h1>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rapports & KPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Consultez les rapports de performance et indicateurs clés.</p>
            </CardContent>
          </Card>
        </div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
