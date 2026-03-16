import { useParams, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCustomSpaces } from "@/hooks/use-custom-spaces";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function AdminCustomSpace() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { spaces } = useCustomSpaces();
  const { getModuleLabel } = useDemoPlan();

  const space = spaces.find((s) => s.id === spaceId);

  if (!space) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-[#22c55e]" />
          <h1 className="text-2xl font-bold text-foreground">{space.name}</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Espace personnalisé basé sur le rôle <span className="font-medium">{space.base_role === "employee" ? "Salarié" : "Client"}</span>
          {space.role_id && <span className="ml-2 text-amber-600">· Rôle & permissions configurables dans Paramètres → Rôles & Droits</span>}
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Modules activés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {space.enabled_modules.map((mod) => (
                <span
                  key={mod}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#22c55e]/10 text-[#15803d] border border-[#22c55e]/20"
                >
                  {getModuleLabel(mod)}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-medium">Cet espace est en cours de configuration</p>
            <p className="text-sm mt-1">Les modules ci-dessus seront accessibles depuis cet espace.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
