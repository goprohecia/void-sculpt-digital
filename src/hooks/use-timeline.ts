import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useRef } from "react";

export const DEFAULT_TIMELINE_STEPS = [
  "Demande reçue",
  "Rendez-vous",
  "Cahier des charges",
  "Devis envoyé",
  "Devis accepté",
  "En cours",
  "Livraison",
  "Terminé",
];

export interface TimelineTemplate {
  id: string;
  name: string;
  steps: string[];
  isDefault: boolean;
}

export interface DossierTimeline {
  id: string;
  dossierId: string;
  templateId: string | null;
  currentStep: number;
  stepDates: Record<string, string>;
  stepNotes: Record<string, string>;
}

export function useTimelineTemplates() {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const demoTemplates = useRef<TimelineTemplate[]>([
    { id: "default", name: "Par défaut", steps: DEFAULT_TIMELINE_STEPS, isDefault: true },
  ]);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["timeline-templates"],
    queryFn: async (): Promise<TimelineTemplate[]> => {
      if (isDemo) return demoTemplates.current;
      const { data, error } = await (supabase as any)
        .from("timeline_templates")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        steps: t.steps as string[],
        isDefault: t.is_default,
      }));
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (template: { name: string; steps: string[] }) => {
      if (isDemo) {
        const newT: TimelineTemplate = {
          id: crypto.randomUUID(),
          name: template.name,
          steps: template.steps,
          isDefault: false,
        };
        demoTemplates.current = [...demoTemplates.current, newT];
        return newT;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await (supabase as any)
        .from("timeline_templates")
        .insert({ name: template.name, steps: template.steps, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["timeline-templates"] }),
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, name, steps }: { id: string; name: string; steps: string[] }) => {
      if (isDemo) {
        demoTemplates.current = demoTemplates.current.map((t) =>
          t.id === id ? { ...t, name, steps } : t
        );
        return;
      }
      const { error } = await (supabase as any)
        .from("timeline_templates")
        .update({ name, steps, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["timeline-templates"] }),
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) {
        demoTemplates.current = demoTemplates.current.filter((t) => t.id !== id);
        return;
      }
      const { error } = await (supabase as any)
        .from("timeline_templates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["timeline-templates"] }),
  });

  const getDefaultTemplate = (): TimelineTemplate => {
    return templates.find((t) => t.isDefault) || templates[0] || {
      id: "default",
      name: "Par défaut",
      steps: DEFAULT_TIMELINE_STEPS,
      isDefault: true,
    };
  };

  return { templates, isLoading, createTemplate, updateTemplate, deleteTemplate, getDefaultTemplate };
}

export function useDossierTimeline(dossierId: string | undefined) {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const demoTimelines = useRef<Record<string, DossierTimeline>>({});

  const { data: timeline, isLoading } = useQuery({
    queryKey: ["dossier-timeline", dossierId],
    enabled: !!dossierId,
    queryFn: async (): Promise<DossierTimeline | null> => {
      if (!dossierId) return null;
      if (isDemo) return demoTimelines.current[dossierId] || null;
      const { data, error } = await (supabase as any)
        .from("dossier_timeline")
        .select("*")
        .eq("dossier_id", dossierId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        dossierId: data.dossier_id,
        templateId: data.template_id,
        currentStep: data.current_step,
        stepDates: (data.step_dates || {}) as Record<string, string>,
        stepNotes: (data.step_notes || {}) as Record<string, string>,
      };
    },
  });

  const upsertTimeline = useMutation({
    mutationFn: async (updates: { currentStep?: number; stepDates?: Record<string, string>; stepNotes?: Record<string, string>; templateId?: string | null }) => {
      if (!dossierId) return;
      if (isDemo) {
        const existing = demoTimelines.current[dossierId];
        demoTimelines.current[dossierId] = {
          id: existing?.id || crypto.randomUUID(),
          dossierId,
          templateId: updates.templateId ?? existing?.templateId ?? null,
          currentStep: updates.currentStep ?? existing?.currentStep ?? 0,
          stepDates: updates.stepDates ?? existing?.stepDates ?? {},
          stepNotes: updates.stepNotes ?? existing?.stepNotes ?? {},
        };
        return;
      }
      const { error } = await (supabase as any)
        .from("dossier_timeline")
        .upsert({
          dossier_id: dossierId,
          current_step: updates.currentStep ?? timeline?.currentStep ?? 0,
          step_dates: updates.stepDates ?? timeline?.stepDates ?? {},
          step_notes: updates.stepNotes ?? timeline?.stepNotes ?? {},
          template_id: updates.templateId !== undefined ? updates.templateId : timeline?.templateId,
          updated_at: new Date().toISOString(),
        }, { onConflict: "dossier_id" });
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["dossier-timeline", dossierId] }),
  });

  return { timeline, isLoading, upsertTimeline };
}
