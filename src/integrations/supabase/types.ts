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
          compte_id: string | null
          created_at: string
          id: string
          model: string
          provider: string
          titre: string
          updated_at: string
        }
        Insert: {
          compte_id?: string | null
          created_at?: string
          id?: string
          model?: string
          provider?: string
          titre?: string
          updated_at?: string
        }
        Update: {
          compte_id?: string | null
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
          compte_id: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          compte_id?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role?: string
        }
        Update: {
          compte_id?: string | null
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
      annonce_lecture: {
        Row: {
          annonce_id: string
          date_lecture: string
          user_id: string
        }
        Insert: {
          annonce_id: string
          date_lecture?: string
          user_id: string
        }
        Update: {
          annonce_id?: string
          date_lecture?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "annonce_lecture_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
        ]
      }
      annonces: {
        Row: {
          cible_filtre_json: Json | null
          cible_type: string
          compte_id: string | null
          contenu: string
          created_at: string
          date_creation: string
          date_expiration: string | null
          id: string
          statut: string
          titre: string
          updated_at: string
        }
        Insert: {
          cible_filtre_json?: Json | null
          cible_type?: string
          compte_id?: string | null
          contenu?: string
          created_at?: string
          date_creation?: string
          date_expiration?: string | null
          id?: string
          statut?: string
          titre: string
          updated_at?: string
        }
        Update: {
          cible_filtre_json?: Json | null
          cible_type?: string
          compte_id?: string | null
          contenu?: string
          created_at?: string
          date_creation?: string
          date_expiration?: string | null
          id?: string
          statut?: string
          titre?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          compte_id: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          compte_id?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          compte_id?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      audit_permissions: {
        Row: {
          ancienne_valeur: boolean | null
          compte_id: string | null
          date_modification: string
          id: string
          nouvelle_valeur: boolean
          permission_code: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          ancienne_valeur?: boolean | null
          compte_id?: string | null
          date_modification?: string
          id?: string
          nouvelle_valeur: boolean
          permission_code: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          ancienne_valeur?: boolean | null
          compte_id?: string | null
          date_modification?: string
          id?: string
          nouvelle_valeur?: boolean
          permission_code?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      bon_commande_lignes: {
        Row: {
          bon_commande_id: string
          compte_id: string | null
          created_at: string
          id: string
          prix_unitaire: number
          produit_id: string
          quantite: number
        }
        Insert: {
          bon_commande_id: string
          compte_id?: string | null
          created_at?: string
          id?: string
          prix_unitaire?: number
          produit_id: string
          quantite?: number
        }
        Update: {
          bon_commande_id?: string
          compte_id?: string | null
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
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
      campagnes_email: {
        Row: {
          brevo_campaign_id: string | null
          compte_id: string | null
          created_at: string
          date_envoi: string
          id: string
          nb_destinataires: number
          objet: string
          source: string | null
          statut: string
        }
        Insert: {
          brevo_campaign_id?: string | null
          compte_id?: string | null
          created_at?: string
          date_envoi?: string
          id?: string
          nb_destinataires?: number
          objet: string
          source?: string | null
          statut?: string
        }
        Update: {
          brevo_campaign_id?: string | null
          compte_id?: string | null
          created_at?: string
          date_envoi?: string
          id?: string
          nb_destinataires?: number
          objet?: string
          source?: string | null
          statut?: string
        }
        Relationships: []
      }
      cdc_historique: {
        Row: {
          action: string
          auteur: string
          cahier_id: string
          compte_id: string | null
          date: string
          description: string
          id: string
        }
        Insert: {
          action: string
          auteur: string
          cahier_id: string
          compte_id?: string | null
          date?: string
          description?: string
          id?: string
        }
        Update: {
          action?: string
          auteur?: string
          cahier_id?: string
          compte_id?: string | null
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
      client_dossier: {
        Row: {
          client_id: string
          compte_id: string | null
          date_liaison: string
          dossier_id: string
          id: string
        }
        Insert: {
          client_id: string
          compte_id?: string | null
          date_liaison?: string
          dossier_id: string
          id?: string
        }
        Update: {
          client_id?: string
          compte_id?: string | null
          date_liaison?: string
          dossier_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_dossier_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_dossier_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tags: {
        Row: {
          client_id: string
          compte_id: string | null
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          client_id: string
          compte_id?: string | null
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          client_id?: string
          compte_id?: string | null
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
          compte_id: string | null
          created_at: string
          date_creation: string
          email: string
          email_opt_out: boolean
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
          compte_id?: string | null
          created_at?: string
          date_creation?: string
          email: string
          email_opt_out?: boolean
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
          compte_id?: string | null
          created_at?: string
          date_creation?: string
          email?: string
          email_opt_out?: boolean
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
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          compte_id: string | null
          created_at: string
          enabled_modules: Json
          id: string
          name: string
          sort_order: number
          user_id: string
        }
        Insert: {
          base_role?: string
          compte_id?: string | null
          created_at?: string
          enabled_modules?: Json
          id?: string
          name: string
          sort_order?: number
          user_id: string
        }
        Update: {
          base_role?: string
          compte_id?: string | null
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
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
      demandes_indisponibilite: {
        Row: {
          commentaire_admin: string | null
          compte_id: string | null
          created_at: string
          date_debut: string
          date_fin: string
          date_traitement: string | null
          employe_id: string
          id: string
          motif: string
          statut: string
        }
        Insert: {
          commentaire_admin?: string | null
          compte_id?: string | null
          created_at?: string
          date_debut: string
          date_fin: string
          date_traitement?: string | null
          employe_id: string
          id?: string
          motif?: string
          statut?: string
        }
        Update: {
          commentaire_admin?: string | null
          compte_id?: string | null
          created_at?: string
          date_debut?: string
          date_fin?: string
          date_traitement?: string | null
          employe_id?: string
          id?: string
          motif?: string
          statut?: string
        }
        Relationships: [
          {
            foreignKeyName: "demandes_indisponibilite_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      devis: {
        Row: {
          client_id: string
          client_nom: string
          compte_id: string | null
          created_at: string
          date_emission: string
          date_signature: string | null
          date_validite: string
          description: string | null
          dossier_id: string | null
          id: string
          montant: number
          reference: string
          service_category_id: string | null
          signataire_nom: string | null
          signature_url: string | null
          statut: string
          titre: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_nom: string
          compte_id?: string | null
          created_at?: string
          date_emission?: string
          date_signature?: string | null
          date_validite: string
          description?: string | null
          dossier_id?: string | null
          id?: string
          montant?: number
          reference: string
          service_category_id?: string | null
          signataire_nom?: string | null
          signature_url?: string | null
          statut?: string
          titre: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          compte_id?: string | null
          created_at?: string
          date_emission?: string
          date_signature?: string | null
          date_validite?: string
          description?: string | null
          dossier_id?: string | null
          id?: string
          montant?: number
          reference?: string
          service_category_id?: string | null
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
          {
            foreignKeyName: "devis_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      donnees_mensuelles: {
        Row: {
          annee: number
          ca_total: number
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
      dossier_employe: {
        Row: {
          compte_id: string | null
          date_assignation: string
          dossier_id: string
          employe_id: string
          id: string
          role_sur_dossier: string
        }
        Insert: {
          compte_id?: string | null
          date_assignation?: string
          dossier_id: string
          employe_id: string
          id?: string
          role_sur_dossier?: string
        }
        Update: {
          compte_id?: string | null
          date_assignation?: string
          dossier_id?: string
          employe_id?: string
          id?: string
          role_sur_dossier?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_employe_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossier_employe_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      dossier_timeline: {
        Row: {
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
      email_events: {
        Row: {
          campagne_id: string | null
          compte_id: string | null
          created_at: string
          date_event: string
          email_destinataire: string
          id: string
          metadata: Json | null
          type_event: string
        }
        Insert: {
          campagne_id?: string | null
          compte_id?: string | null
          created_at?: string
          date_event?: string
          email_destinataire: string
          id?: string
          metadata?: Json | null
          type_event: string
        }
        Update: {
          campagne_id?: string | null
          compte_id?: string | null
          created_at?: string
          date_event?: string
          email_destinataire?: string
          id?: string
          metadata?: Json | null
          type_event?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          client_id: string | null
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          compte_id: string | null
          contenu: string
          created_at: string
          id: string
          nom: string
          sujet: string
          type: string
          updated_at: string
        }
        Insert: {
          compte_id?: string | null
          contenu?: string
          created_at?: string
          id?: string
          nom: string
          sujet?: string
          type?: string
          updated_at?: string
        }
        Update: {
          compte_id?: string | null
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
      emails_planifies: {
        Row: {
          brevo_campaign_id: string | null
          compte_id: string | null
          contenu: string
          created_at: string
          date_envoi_planifie: string
          destinataires_json: Json
          id: string
          nb_destinataires: number
          objet: string
          pieces_jointes: Json | null
          statut: string
          updated_at: string
        }
        Insert: {
          brevo_campaign_id?: string | null
          compte_id?: string | null
          contenu?: string
          created_at?: string
          date_envoi_planifie: string
          destinataires_json?: Json
          id?: string
          nb_destinataires?: number
          objet: string
          pieces_jointes?: Json | null
          statut?: string
          updated_at?: string
        }
        Update: {
          brevo_campaign_id?: string | null
          compte_id?: string | null
          contenu?: string
          created_at?: string
          date_envoi_planifie?: string
          destinataires_json?: Json
          id?: string
          nb_destinataires?: number
          objet?: string
          pieces_jointes?: Json | null
          statut?: string
          updated_at?: string
        }
        Relationships: []
      }
      employe_role: {
        Row: {
          compte_id: string | null
          date_assignation: string
          employe_id: string
          id: string
          role_id: string
        }
        Insert: {
          compte_id?: string | null
          date_assignation?: string
          employe_id: string
          id?: string
          role_id: string
        }
        Update: {
          compte_id?: string | null
          date_assignation?: string
          employe_id?: string
          id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employe_role_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employe_role_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          acces_modules: Json
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
      evenements_calendrier: {
        Row: {
          client_id: string | null
          compte_id: string | null
          created_at: string
          date_debut: string
          date_fin: string
          description: string | null
          employe_id: string | null
          id: string
          statut: string
          titre: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          compte_id?: string | null
          created_at?: string
          date_debut: string
          date_fin: string
          description?: string | null
          employe_id?: string | null
          id?: string
          statut?: string
          titre?: string
          type?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          compte_id?: string | null
          created_at?: string
          date_debut?: string
          date_fin?: string
          description?: string | null
          employe_id?: string | null
          id?: string
          statut?: string
          titre?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evenements_calendrier_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evenements_calendrier_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      events_manuels: {
        Row: {
          client_id: string | null
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          compte_id: string | null
          created_at: string
          date_echeance: string
          date_emission: string
          description: string | null
          dossier_id: string | null
          id: string
          montant: number
          reference: string
          service_category_id: string | null
          statut: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_nom: string
          compte_id?: string | null
          created_at?: string
          date_echeance: string
          date_emission?: string
          description?: string | null
          dossier_id?: string | null
          id?: string
          montant?: number
          reference: string
          service_category_id?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          compte_id?: string | null
          created_at?: string
          date_echeance?: string
          date_emission?: string
          description?: string | null
          dossier_id?: string | null
          id?: string
          montant?: number
          reference?: string
          service_category_id?: string | null
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
          {
            foreignKeyName: "factures_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      fournisseurs: {
        Row: {
          adresse: string | null
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          compte_id: string | null
          contenu: string
          conversation_id: string
          created_at: string
          date: string
          id: string
          media_name: string | null
          media_size: number | null
          media_type: string | null
          media_url: string | null
          role: string
        }
        Insert: {
          compte_id?: string | null
          contenu: string
          conversation_id: string
          created_at?: string
          date?: string
          id?: string
          media_name?: string | null
          media_size?: number | null
          media_type?: string | null
          media_url?: string | null
          role: string
        }
        Update: {
          compte_id?: string | null
          contenu?: string
          conversation_id?: string
          created_at?: string
          date?: string
          id?: string
          media_name?: string | null
          media_size?: number | null
          media_type?: string | null
          media_url?: string | null
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
      metier_vocabulaire: {
        Row: {
          champ: string
          compte_id: string | null
          created_at: string
          id: string
          label_custom: string
          metier_id: string
        }
        Insert: {
          champ: string
          compte_id?: string | null
          created_at?: string
          id?: string
          label_custom: string
          metier_id: string
        }
        Update: {
          champ?: string
          compte_id?: string | null
          created_at?: string
          id?: string
          label_custom?: string
          metier_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          client_id: string | null
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          compte_id: string | null
          id: string
          mois: string
          objectif: number
          updated_at: string
        }
        Insert: {
          compte_id?: string | null
          id?: string
          mois: string
          objectif: number
          updated_at?: string
        }
        Update: {
          compte_id?: string | null
          id?: string
          mois?: string
          objectif?: number
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          categorie: string
          code: string
          description_lisible: string
          id: string
        }
        Insert: {
          categorie?: string
          code: string
          description_lisible?: string
          id?: string
        }
        Update: {
          categorie?: string
          code?: string
          description_lisible?: string
          id?: string
        }
        Relationships: []
      }
      preview_visits: {
        Row: {
          compte_id: string | null
          date: string
          device: string
          dossier_id: string
          id: string
        }
        Insert: {
          compte_id?: string | null
          date?: string
          device?: string
          dossier_id: string
          id?: string
        }
        Update: {
          compte_id?: string | null
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
          compte_id: string | null
          couleur: string | null
          created_at: string
          description: string | null
          id: string
          nom: string
          updated_at: string
        }
        Insert: {
          compte_id?: string | null
          couleur?: string | null
          created_at?: string
          description?: string | null
          id?: string
          nom: string
          updated_at?: string
        }
        Update: {
          compte_id?: string | null
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
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
          valeur: boolean
        }
        Insert: {
          permission_id: string
          role_id: string
          valeur?: boolean
        }
        Update: {
          permission_id?: string
          role_id?: string
          valeur?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          compte_id: string | null
          date_creation: string
          description: string | null
          id: string
          nom: string
        }
        Insert: {
          compte_id?: string | null
          date_creation?: string
          description?: string | null
          id?: string
          nom: string
        }
        Update: {
          compte_id?: string | null
          date_creation?: string
          description?: string | null
          id?: string
          nom?: string
        }
        Relationships: []
      }
      send_logs: {
        Row: {
          client_id: string
          client_nom: string
          compte_id: string | null
          date_envoi: string
          doc_reference: string
          doc_type: string
          id: string
        }
        Insert: {
          client_id: string
          client_nom: string
          compte_id?: string | null
          date_envoi?: string
          doc_reference: string
          doc_type: string
          id?: string
        }
        Update: {
          client_id?: string
          client_nom?: string
          compte_id?: string | null
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
      service_categories: {
        Row: {
          compte_id: string | null
          couleur: string
          created_at: string
          id: string
          mots_cles: string[]
          nom: string
          ordre: number
        }
        Insert: {
          compte_id?: string | null
          couleur?: string
          created_at?: string
          id?: string
          mots_cles?: string[]
          nom: string
          ordre?: number
        }
        Update: {
          compte_id?: string | null
          couleur?: string
          created_at?: string
          id?: string
          mots_cles?: string[]
          nom?: string
          ordre?: number
        }
        Relationships: []
      }
      stock_mouvements: {
        Row: {
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          sector: string | null
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
          sector?: string | null
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
          sector?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          compte_id: string | null
          couleur: string | null
          created_at: string
          id: string
          nom: string
        }
        Insert: {
          compte_id?: string | null
          couleur?: string | null
          created_at?: string
          id?: string
          nom: string
        }
        Update: {
          compte_id?: string | null
          couleur?: string | null
          created_at?: string
          id?: string
          nom?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          compte_id: string | null
          contenu: string
          created_at: string
          date: string
          id: string
          role: string
          ticket_id: string
        }
        Insert: {
          compte_id?: string | null
          contenu: string
          created_at?: string
          date?: string
          id?: string
          role: string
          ticket_id: string
        }
        Update: {
          compte_id?: string | null
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
          compte_id: string | null
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
          compte_id?: string | null
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
          compte_id?: string | null
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
          compte_id: string | null
          created_at: string
          id: string
          is_default: boolean
          name: string
          steps: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          compte_id?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          steps?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          compte_id?: string | null
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
      check_permission: {
        Args: { _permission_code: string; _user_id: string }
        Returns: boolean
      }
      get_user_compte_id: { Args: never; Returns: string }
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
