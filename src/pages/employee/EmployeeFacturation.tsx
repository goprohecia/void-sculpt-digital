import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";

export default function EmployeeFacturation() {
  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Facturation
          </h1>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Devis & Factures</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Consultez les devis et factures liés à vos dossiers.</p>
            </CardContent>
          </Card>
        </div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
