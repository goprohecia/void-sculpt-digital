import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function EmployeeEmails() {
  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Emails
          </h1>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique des emails</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Consultez les emails envoyés et les templates disponibles.</p>
            </CardContent>
          </Card>
        </div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
