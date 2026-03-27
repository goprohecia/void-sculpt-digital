// [MBA] Module Logements interactif — page admin wrapper avec state management
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { LogementsList } from "@/components/conciergerie/LogementsList";
import { LogementFiche } from "@/components/conciergerie/LogementFiche";
import { LogementCreateModal } from "@/components/conciergerie/LogementCreateModal";
import { MOCK_CONCIERGERIE_BIENS, MOCK_CONCIERGERIE_RESERVATIONS, type ConciergerieBien, type ConciergerieReservation } from "@/data/mockConciergerieData";

export default function AdminLogements() {
  const [selectedLogementId, setSelectedLogementId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  // [MBA] Module Logements interactif — state local (Supabase quand Hamza confirme)
  const [logements, setLogements] = useState<ConciergerieBien[]>([...MOCK_CONCIERGERIE_BIENS]);
  const [reservations, setReservations] = useState<ConciergerieReservation[]>([...MOCK_CONCIERGERIE_RESERVATIONS]);

  const handleCreateLogement = (logement: ConciergerieBien) => {
    setLogements(prev => [logement, ...prev]);
  };

  const handleAddReservation = (resa: ConciergerieReservation) => {
    setReservations(prev => [...prev, resa]);
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        {selectedLogementId ? (
          <LogementFiche
            logementId={selectedLogementId}
            logements={logements}
            reservations={reservations}
            onBack={() => setSelectedLogementId(null)}
            onAddReservation={handleAddReservation}
          />
        ) : (
          <LogementsList
            logements={logements}
            onSelectLogement={setSelectedLogementId}
            onCreateClick={() => setShowCreate(true)}
          />
        )}
      </AdminPageTransition>

      <LogementCreateModal
        open={showCreate}
        onOpenChange={setShowCreate}
        onSave={handleCreateLogement}
      />
    </AdminLayout>
  );
}
