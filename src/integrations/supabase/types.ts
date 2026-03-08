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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          model: string
          provider: string
          titre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          model?: string
          provider?: string
          titre?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          model?: string
          provider?: string
          titre?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      bon_commande_lignes: {
        Row: {
          bon_commande_id: string
          created_at: string
          id: string
          prix_unitaire: number
          produit_id: string
          quantite: number
        }
        Insert: {
          bon_commande_id: string
          created_at?: string
          id?: string
          prix_unitaire?: number
          produit_id: string
          quantite?: number
        }
        Update: {
          bon_commande_id?: string
          created_at?: string
          id?: string
          prix_unitaire?: number
          produit_id?: string
          quantite?: number
        }
        Relationships: [
          {
            foreignKeyName: "bon_commande_lignes_bon_commande_id_fkey"
            columns: ["bon_commande_id"]
            isOneToOne: false
            referencedRelation: "bons_commande"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bon_commande_lignes_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      bons_commande: {
        Row: {
          created_at: string
          date_commande: string
          date_livraison_prevue: string | null
          fournisseur_id: string
          id: string
          montant_total: number
          notes: string | null
          reference: string
          statut: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_commande?: string
          date_livraison_prevue?: string | null
          fournisseur_id: string
          id?: string
          montant_total?: number
          notes?: string | null
          reference: string
          statut?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_commande?: string
          date_livraison_prevue?: string | null
          fournisseur_id?: string
          id?: string
          montant_total?: number
          notes?: string | null
          reference?: string
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bons_commande_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
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
          pieces_jointes: Json | null
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
          pieces_jointes?: Json | null
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
          pieces_jointes?: Json | null
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
      client_tags: {
        Row: {
          client_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tags_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
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
          segment: string
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
          segment?: string
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
          segment?: string
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
      custom_spaces: {
        Row: {
          base_role: string
          created_at: string
          enabled_modules: Json
          id: string
          name: string
          sort_order: number
          user_id: string
        }
        Insert: {
          base_role?: string
          created_at?: string
          enabled_modules?: Json
          id?: string
          name: string
          sort_order?: number
          user_id: string
        }
        Update: {
          base_role?: string
          created_at?: string
          enabled_modules?: Json
          id?: string
          name?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: []
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
      dossier_timeline: {
        Row: {
          created_at: string
          current_step: number
          dossier_id: string
          id: string
          step_dates: Json
          step_notes: Json
          template_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: number
          dossier_id: string
          id?: string
          step_dates?: Json
          step_notes?: Json
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: number
          dossier_id?: string
          id?: string
          step_dates?: Json
          step_notes?: Json
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_timeline_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: true
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossier_timeline_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "timeline_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      dossiers: {
        Row: {
          client_id: string
          client_nom: string
          created_at: string
          date_creation: string
          date_echeance: string | null
          demande_id: string | null
          employee_id: string | null
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
          employee_id?: string | null
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
          employee_id?: string | null
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
          {
            foreignKeyName: "dossiers_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
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
      email_templates: {
        Row: {
          contenu: string
          created_at: string
          id: string
          nom: string
          sujet: string
          type: string
          updated_at: string
        }
        Insert: {
          contenu?: string
          created_at?: string
          id?: string
          nom: string
          sujet?: string
          type?: string
          updated_at?: string
        }
        Update: {
          contenu?: string
          created_at?: string
          id?: string
          nom?: string
          sujet?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          acces_modules: Json
          created_at: string
          date_embauche: string | null
          email: string
          id: string
          nom: string
          poste: string | null
          prenom: string
          statut: string
          telephone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          acces_modules?: Json
          created_at?: string
          date_embauche?: string | null
          email?: string
          id?: string
          nom?: string
          poste?: string | null
          prenom?: string
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          acces_modules?: Json
          created_at?: string
          date_embauche?: string | null
          email?: string
          id?: string
          nom?: string
          poste?: string | null
          prenom?: string
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      events_manuels: {
        Row: {
          client_id: string | null
          created_at: string
          date: string
          description: string | null
          duree: number
          employee_id: string | null
          heure: string
          id: string
          titre: string
          type: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          duree?: number
          employee_id?: string | null
          heure?: string
          id?: string
          titre: string
          type?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          duree?: number
          employee_id?: string | null
          heure?: string
          id?: string
          titre?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_manuels_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_manuels_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
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
      fournisseurs: {
        Row: {
          adresse: string | null
          created_at: string
          email: string | null
          id: string
          nom: string
          notes: string | null
          pays: string | null
          statut: string
          telephone: string | null
          updated_at: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nom: string
          notes?: string | null
          pays?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nom?: string
          notes?: string | null
          pays?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
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
      product_categories: {
        Row: {
          couleur: string | null
          created_at: string
          description: string | null
          id: string
          nom: string
          updated_at: string
        }
        Insert: {
          couleur?: string | null
          created_at?: string
          description?: string | null
          id?: string
          nom: string
          updated_at?: string
        }
        Update: {
          couleur?: string | null
          created_at?: string
          description?: string | null
          id?: string
          nom?: string
          updated_at?: string
        }
        Relationships: []
      }
      produits: {
        Row: {
          categorie_id: string | null
          created_at: string
          description: string | null
          fournisseur_id: string | null
          id: string
          nom: string
          prix_achat: number
          prix_vente: number
          quantite_stock: number
          reference: string
          seuil_alerte: number
          sku: string | null
          statut: string
          unite: string | null
          updated_at: string
        }
        Insert: {
          categorie_id?: string | null
          created_at?: string
          description?: string | null
          fournisseur_id?: string | null
          id?: string
          nom: string
          prix_achat?: number
          prix_vente?: number
          quantite_stock?: number
          reference: string
          seuil_alerte?: number
          sku?: string | null
          statut?: string
          unite?: string | null
          updated_at?: string
        }
        Update: {
          categorie_id?: string | null
          created_at?: string
          description?: string | null
          fournisseur_id?: string | null
          id?: string
          nom?: string
          prix_achat?: number
          prix_vente?: number
          quantite_stock?: number
          reference?: string
          seuil_alerte?: number
          sku?: string | null
          statut?: string
          unite?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produits_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produits_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
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
      stock_mouvements: {
        Row: {
          created_at: string
          effectue_par: string | null
          id: string
          motif: string | null
          produit_id: string
          quantite: number
          reference_doc: string | null
          type: string
        }
        Insert: {
          created_at?: string
          effectue_par?: string | null
          id?: string
          motif?: string | null
          produit_id: string
          quantite: number
          reference_doc?: string | null
          type: string
        }
        Update: {
          created_at?: string
          effectue_par?: string | null
          id?: string
          motif?: string | null
          produit_id?: string
          quantite?: number
          reference_doc?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_mouvements_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          custom_modules: Json | null
          expires_at: string | null
          id: string
          modules_limit: number | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_modules?: Json | null
          expires_at?: string | null
          id?: string
          modules_limit?: number | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_modules?: Json | null
          expires_at?: string | null
          id?: string
          modules_limit?: number | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          couleur: string | null
          created_at: string
          id: string
          nom: string
        }
        Insert: {
          couleur?: string | null
          created_at?: string
          id?: string
          nom: string
        }
        Update: {
          couleur?: string | null
          created_at?: string
          id?: string
          nom?: string
        }
        Relationships: []
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
      timeline_templates: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          name: string
          steps: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          steps?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          steps?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      app_role: "admin" | "client" | "employee"
      subscription_plan: "starter" | "business" | "enterprise"
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
      app_role: ["admin", "client", "employee"],
      subscription_plan: ["starter", "business", "enterprise"],
    },
  },
} as const
