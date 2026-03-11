import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Building2, Bell } from "lucide-react";
import { useClients } from "@/hooks/use-clients";
import { useClientId } from "@/hooks/use-client-id";
import { ProfileTab } from "@/components/client/settings/ProfileTab";
import { CompanyTab } from "@/components/client/settings/CompanyTab";
import { NotificationsTab } from "@/components/client/settings/NotificationsTab";

export default function ClientSettings() {
  const { clientId, isLoading: clientLoading } = useClientId();
  const { getClientById, updateClient } = useClients();
  const client = clientId ? getClientById(clientId) : undefined;

  if (clientLoading) return <ClientLayout><div className="p-8 text-center text-muted-foreground">Chargement...</div></ClientLayout>;
  if (!client) return <ClientLayout><div className="p-8 text-center text-muted-foreground">Aucune fiche client trouvée.</div></ClientLayout>;

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6 max-w-3xl" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-[hsl(200,100%,50%)]" />
              Paramètres
            </h1>
            <p className="text-muted-foreground text-sm">Gérez vos informations personnelles et vos préférences</p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Tabs defaultValue="profil" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profil" className="gap-1.5"><User className="h-3.5 w-3.5" /> Profil</TabsTrigger>
                <TabsTrigger value="entreprise" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Entreprise</TabsTrigger>
                <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profil">
                <ProfileTab client={client} clientId={clientId!} updateClient={updateClient} />
              </TabsContent>

              <TabsContent value="entreprise">
                <CompanyTab client={client} clientId={clientId!} updateClient={updateClient} />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationsTab />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
