export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cahiers_des_charges: {
        Row: {
          budget_complementaire: string
          commentaires_admin: string | null
          contexte: string
          contraintes_techniques: string
          created_at: string
          date_mise_a_jour: string
          demande_id: string
          design_notes: string
          fonctionnalites: string[]
          id: string
          motif_rejet: string | null
          nb_rejets: number
          planning_souhaite: string
          public_cible: string
          remarques: string
          statut: string
          updated_at: string
        }
        Insert: {
          budget_complementaire?: string
          commentaires_admin?: string | null
          contexte?: string
          contraintes_techniques?: string
          created_at?: string
          date_mise_a_jour?: string
          demande_id: string
          design_notes?: string
          fonctionnalites?: string[]
          id?: string
          motif_rejet?: string | null
          nb_rejets?: number
          planning_souhaite?: string
          public_cible?: string
          remarques?: string
          statut?: string
          updated_at?: string
        }
        Update: {
          budget_complementaire?: string
          commentaires_admin?: string | null
          contexte?: string
          contraintes_techniques?: string
          created_at?: string
          date_mise_a_jour?: string
          demande_id?: string
          design_notes?: string
          fonctionnalites?: string[]
          id?: string
          motif_rejet?: string | null
          nb_rejets?: number
          planning_souhaite?: string
          public_cible?: string
          remarques?: string
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cahiers_des_charges_demande_id_fkey"
            columns: ["demande_id"]
            isOneToOne: false
            referencedRelation: "demandes"
            referencedColumns: ["id"]
          },
        ]
      }
      cdc_historique: {
        Row: {
          action: string
          auteur: string
          cahier_id: string
          date: string
          description: string
          id: string
        }
        Insert: {
          action: string
          auteur: string
          cahier_id: string
          date?: string
          description?: string
          id?: string
        }
        Update: {
          action?: string
          auteur?: string
          cahier_id?: string
          date?: string
          description?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cdc_historique_cahier_id_fkey"
            columns: ["cahier_id"]
            isOneToOne: false
            referencedRelation: "cahiers_des_charges"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          adresse: string | null
          code_postal: string | null
          created_at: string
          date_creation: string
          email: string
          entreprise: string
          id: string
          nom: string
          nombre_dossiers: number
          pays: string | null
          prenom: string
          siret: string | null
          statut: string
          telephone: string
          updated_at: string
          user_id: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string
          date_creation?: string
          email: string
          entreprise?: string
          id?: string
          nom: string
          nombre_dossiers?: number
          pays?: string | null
          prenom: string
          siret?: string | null
          statut?: string
          telephone?: string
          updated_at?: string
          user_id?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string
          date_creation?: string
          email?: string
          entreprise?: string
          id?: string
          nom?: string
          nombre_dossiers?: number
          pays?: string | null
          prenom?: string
          siret?: string | null
          statut?: string
          telephone?: string
          updated_at?: string
          user_id?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string
          client_nom: string
          created_at: string
          dernier_message: string
          id: string
          non_lus: number
          sujet: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_nom: string
          created_at?: string
          dernier_message?: string
          id?: string
          non_lus?: number
          sujet: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          created_at?: string
          dernier_message?: string
          id?: string
          non_lus?: number
          sujet?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      demandes: {
        Row: {
          budget: string | null
          client_id: string
          client_nom: string
          created_at: string
          date_creation: string
          date_mise_a_jour: string
          description: string
          id: string
          reference: string
          statut: string
          titre: string
          type_prestation: string
          updated_at: string
        }
        Insert: {
          budget?: string | null
          client_id: string
          client_nom: string
          created_at?: string
          date_creation?: string
          date_mise_a_jour?: string
          description?: string
          id?: string
          reference: string
          statut?: string
          titre: string
          type_prestation?: string
          updated_at?: string
        }
        Update: {
          budget?: string | null
          client_id?: string
          client_nom?: string
          created_at?: string
          date_creation?: string
          date_mise_a_jour?: string
          description?: string
          id?: string
          reference?: string
          statut?: string
          titre?: string
          type_prestation?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demandes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      devis: {
        Row: {
          client_id: string
          client_nom: string
          created_at: string
          date_emission: string
          date_signature: string | null
          date_validite: string
          dossier_id: string | null
          id: string
          montant: number
          reference: string
          signataire_nom: string | null
          signature_url: string | null
          statut: string
          titre: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_nom: string
          created_at?: string
          date_emission?: string
          date_signature?: string | null
          date_validite: string
          dossier_id?: string | null
          id?: string
          montant?: number
          reference: string
          signataire_nom?: string | null
          signature_url?: string | null
          statut?: string
          titre: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          created_at?: string
          date_emission?: string
          date_signature?: string | null
          date_validite?: string
          dossier_id?: string | null
          id?: string
          montant?: number
          reference?: string
          signataire_nom?: string | null
          signature_url?: string | null
          statut?: string
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "devis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      donnees_mensuelles: {
        Row: {
          annee: number
          ca_total: number
          conversion: number
          created_at: string
          dossiers: number
          encaissements: number
          id: string
          mois: string
          nouveaux_clients: number
          objectif: number
          panier_moyen: number
          updated_at: string
        }
        Insert: {
          annee?: number
          ca_total?: number
          conversion?: number
          created_at?: string
          dossiers?: number
          encaissements?: number
          id?: string
          mois: string
          nouveaux_clients?: number
          objectif?: number
          panier_moyen?: number
          updated_at?: string
        }
        Update: {
          annee?: number
          ca_total?: number
          conversion?: number
          created_at?: string
          dossiers?: number
          encaissements?: number
          id?: string
          mois?: string
          nouveaux_clients?: number
          objectif?: number
          panier_moyen?: number
          updated_at?: string
        }
        Relationships: []
      }
      dossiers: {
        Row: {
          client_id: string
          client_nom: string
          created_at: string
          date_creation: string
          date_echeance: string | null
          demande_id: string | null
          id: string
          montant: number
          preview_url: string | null
          rdv_effectue: boolean
          reference: string
          statut: string
          type_prestation: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_nom: string
          created_at?: string
          date_creation?: string
          date_echeance?: string | null
          demande_id?: string | null
          id?: string
          montant?: number
          preview_url?: string | null
          rdv_effectue?: boolean
          reference: string
          statut?: string
          type_prestation: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          created_at?: string
          date_creation?: string
          date_echeance?: string | null
          demande_id?: string | null
          id?: string
          montant?: number
          preview_url?: string | null
          rdv_effectue?: boolean
          reference?: string
          statut?: string
          type_prestation?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossiers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          client_id: string | null
          contenu: string
          date_envoi: string
          destinataire: string
          id: string
          reference: string | null
          sujet: string
          type: string
        }
        Insert: {
          client_id?: string | null
          contenu?: string
          date_envoi?: string
          destinataire: string
          id?: string
          reference?: string | null
          sujet: string
          type: string
        }
        Update: {
          client_id?: string | null
          contenu?: string
          date_envoi?: string
          destinataire?: string
          id?: string
          reference?: string | null
          sujet?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      factures: {
        Row: {
          client_id: string
          client_nom: string
          created_at: string
          date_echeance: string
          date_emission: string
          dossier_id: string | null
          id: string
          montant: number
          reference: string
          statut: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_nom: string
          created_at?: string
          date_echeance: string
          date_emission?: string
          dossier_id?: string | null
          id?: string
          montant?: number
          reference: string
          statut?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          created_at?: string
          date_echeance?: string
          date_emission?: string
          dossier_id?: string | null
          id?: string
          montant?: number
          reference?: string
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "factures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          contenu: string
          conversation_id: string
          created_at: string
          date: string
          id: string
          role: string
        }
        Insert: {
          contenu: string
          conversation_id: string
          created_at?: string
          date?: string
          id?: string
          role: string
        }
        Update: {
          contenu?: string
          conversation_id?: string
          created_at?: string
          date?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          client_id: string | null
          created_at: string
          date: string
          description: string
          destinataire: string
          id: string
          lien: string
          lu: boolean
          titre: string
          type: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date?: string
          description?: string
          destinataire: string
          id?: string
          lien?: string
          lu?: boolean
          titre: string
          type: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date?: string
          description?: string
          destinataire?: string
          id?: string
          lien?: string
          lu?: boolean
          titre?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      objectifs_mensuels: {
        Row: {
          id: string
          mois: string
          objectif: number
          updated_at: string
        }
        Insert: {
          id?: string
          mois: string
          objectif: number
          updated_at?: string
        }
        Update: {
          id?: string
          mois?: string
          objectif?: number
          updated_at?: string
        }
        Relationships: []
      }
      preview_visits: {
        Row: {
          date: string
          device: string
          dossier_id: string
          id: string
        }
        Insert: {
          date?: string
          device?: string
          dossier_id: string
          id?: string
        }
        Update: {
          date?: string
          device?: string
          dossier_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preview_visits_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nom: string
          telephone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          telephone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      relances: {
        Row: {
          client_id: string
          client_nom: string
          created_at: string
          date_prochaine: string | null
          date_relance: string
          facture_id: string
          facture_ref: string
          id: string
          montant: number
          statut: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_nom: string
          created_at?: string
          date_prochaine?: string | null
          date_relance?: string
          facture_id: string
          facture_ref: string
          id?: string
          montant?: number
          statut?: string
          type?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          created_at?: string
          date_prochaine?: string | null
          date_relance?: string
          facture_id?: string
          facture_ref?: string
          id?: string
          montant?: number
          statut?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relances_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relances_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      send_logs: {
        Row: {
          client_id: string
          client_nom: string
          date_envoi: string
          doc_reference: string
          doc_type: string
          id: string
        }
        Insert: {
          client_id: string
          client_nom: string
          date_envoi?: string
          doc_reference: string
          doc_type: string
          id?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          date_envoi?: string
          doc_reference?: string
          doc_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "send_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          contenu: string
          created_at: string
          date: string
          id: string
          role: string
          ticket_id: string
        }
        Insert: {
          contenu: string
          created_at?: string
          date?: string
          id?: string
          role: string
          ticket_id: string
        }
        Update: {
          contenu?: string
          created_at?: string
          date?: string
          id?: string
          role?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          client_id: string
          client_nom: string
          created_at: string
          date_creation: string
          date_mise_a_jour: string
          description: string
          id: string
          priorite: string
          reference: string
          statut: string
          sujet: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_nom: string
          created_at?: string
          date_creation?: string
          date_mise_a_jour?: string
          description?: string
          id?: string
          priorite?: string
          reference: string
          statut?: string
          sujet: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          created_at?: string
          date_creation?: string
          date_mise_a_jour?: string
          description?: string
          id?: string
          priorite?: string
          reference?: string
          statut?: string
          sujet?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client"],
    },
  },
} as const
