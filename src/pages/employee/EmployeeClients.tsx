import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function EmployeeClients() {
  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Clients
          </h1>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Liste des clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Consultez les fiches clients associées à vos dossiers.</p>
            </CardContent>
          </Card>
        </div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
